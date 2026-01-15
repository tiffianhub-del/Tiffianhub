// routes/contact.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');

// POST /api/contact/:id
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  try {
    // Populate the user linked to the listing
    const listing = await Listing.findById(id).populate('user', 'email name');

    if (!listing || !listing.user?.email) {
      return res.status(404).json({ error: 'Listing not found or missing email' });
    }

    const providerEmail = listing.user.email;
    const providerId = listing.user._id;

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set in environment variables');
      console.error('   For local testing, create backend/.env file with:');
      console.error('   RESEND_API_KEY=re_your_api_key_here');
      return res.status(500).json({ 
        error: 'Email service not configured. Please contact support.' 
      });
    }
    
    // Determine the "from" email address
    // Resend only allows verified domains or their default onboarding@resend.dev
    // Gmail.com and other public email domains cannot be verified
    let fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    // Check if the configured email uses an unverifiable domain (gmail.com, yahoo.com, etc.)
    const unverifiableDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const emailDomain = fromEmail.split('@')[1]?.toLowerCase();
    
    if (emailDomain && unverifiableDomains.includes(emailDomain)) {
      console.warn(`⚠️  RESEND_FROM_EMAIL (${fromEmail}) uses an unverifiable domain (${emailDomain})`);
      console.warn('   Falling back to onboarding@resend.dev');
      console.warn('   To use a custom domain, verify it at https://resend.com/domains');
      fromEmail = 'onboarding@resend.dev';
    }
    
    console.log('📧 Attempting to send email via Resend...');
    console.log('   From:', fromEmail);
    console.log('   To:', providerEmail);

    // Use Resend API instead of SMTP (works on Render free tier)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: providerEmail,
        reply_to: email,
        subject: `New message about your listing: ${listing.title}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Message About Your Listing</h2>
            <p><strong>Listing:</strong> ${listing.title}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">You can reply directly to this email to respond to ${name}.</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({}));
      console.error('Resend API error:', errorData);
      
      // Check for domain verification errors
      const errorMessage = errorData.message || '';
      if (errorMessage.includes('domain is not verified') || errorMessage.includes('not verified')) {
        console.error('❌ Domain verification error detected');
        console.error('   The configured RESEND_FROM_EMAIL uses an unverified domain');
        console.error('   Solution: Remove RESEND_FROM_EMAIL from environment variables');
        console.error('   Or verify your domain at https://resend.com/domains');
        console.error('   The system will automatically use onboarding@resend.dev');
        
        // Try again with onboarding@resend.dev if a different email was used
        if (fromEmail !== 'onboarding@resend.dev') {
          console.log('🔄 Retrying with onboarding@resend.dev...');
          const retryResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: providerEmail,
              reply_to: email,
              subject: `New message about your listing: ${listing.title}`,
              text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333;">New Message About Your Listing</h2>
                  <p><strong>Listing:</strong> ${listing.title}</p>
                  <hr style="border: 1px solid #eee; margin: 20px 0;">
                  <p><strong>From:</strong> ${name} (${email})</p>
                  <p><strong>Message:</strong></p>
                  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>
                  <hr style="border: 1px solid #eee; margin: 20px 0;">
                  <p style="color: #666; font-size: 12px;">You can reply directly to this email to respond to ${name}.</p>
                </div>
              `,
            }),
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            console.log('✅ Email sent successfully via Resend (using fallback):', retryData.id);
            // Create notification for provider
            await Notification.create({
              provider: providerId,
              listing: id,
              fromName: name,
              fromEmail: email,
              message: message,
              read: false,
            });
            return res.json({ success: true, message: 'Message sent successfully!' });
          } else {
            // If retry also failed, log the error
            const retryErrorData = await retryResponse.json().catch(() => ({}));
            console.error('Retry also failed:', retryErrorData);
          }
        }
      }
      
      throw new Error(errorData.message || `Resend API error: ${resendResponse.status}`);
    }

    const emailData = await resendResponse.json();
    console.log('✅ Email sent successfully via Resend:', emailData.id);

    // Create notification for provider
    await Notification.create({
      provider: providerId,
      listing: id,
      fromName: name,
      fromEmail: email,
      message: message,
      read: false,
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Error sending message:', err);
    
    // More specific error messages
    if (err.message.includes('Resend API')) {
      return res.status(500).json({ 
        error: 'Email service error. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: err.message || 'Failed to send message' 
    });
  }
});

module.exports = router;
