// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/Listing");
// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");

// // POST /api/contact/:listingId
// router.post("/:listingId", async (req, res) => {
//   try {
//     const { listingId } = req.params;
//     const { name, email, message } = req.body;

//     // Find listing + provider
//     const listing = await Listing.findById(listingId).populate("user");
//     if (!listing) return res.status(404).json({ message: "Listing not found" });

//     const provider = await User.findById(listing.user._id);
//     if (!provider) return res.status(404).json({ message: "Provider not found" });

//     // Send email to provider
//     await sendEmail({
//       to: provider.email,
//       subject: `New Inquiry for ${listing.title}`,
//       text: `You got a new message from ${name} (${email}):\n\n${message}`,
//       html: `<p><strong>From:</strong> ${name} (${email})</p>
//              <p><strong>Message:</strong></p>
//              <p>${message}</p>`,
//     });

//     res.json({ success: true, message: "Message sent to provider!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Failed to send email" });
//   }
// });

// module.exports = router;


// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Listing = require('../models/Listing'); // Listing model
const User = require('../models/User');       // User model
const Notification = require('../models/Notification'); // Notification model

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

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email to provider
    await transporter.sendMail({
      from: process.env.SMTP_USER, // your SMTP account
      replyTo: email,               // actual sender (user filling form)
      to: providerEmail,            // provider's email
      subject: `New message about your listing: ${listing.title}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

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
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
