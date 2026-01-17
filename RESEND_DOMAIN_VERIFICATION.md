# Resend Domain Verification Guide

## Problem
You're seeing this error:
> "You can only send testing emails to your own email address (tiffianhub@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the 'from' address to an email using this domain."

This happens because `onboarding@resend.dev` (Resend's default testing email) can only send emails to the account owner's email address.

## Solution: Verify Your Domain

To send emails to any recipient, you need to verify a domain you own with Resend.

### Step 1: Verify Your Domain

1. **Go to Resend Domains:**
   - Visit: https://resend.com/domains
   - Sign in to your Resend account

2. **Add Your Domain:**
   - Click "Add Domain" or "Verify Domain"
   - Enter your domain (e.g., `yourdomain.com` or `tiffianhub.com`)
   - Click "Add"

3. **Add DNS Records:**
   Resend will provide you with DNS records to add. You'll typically need:
   - **SPF Record** (TXT record)
   - **DKIM Record** (TXT record)
   - **DMARC Record** (optional but recommended)

4. **Add Records to Your Domain Provider:**
   - Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Go to DNS settings
   - Add the TXT records provided by Resend
   - Save the changes

5. **Wait for Verification:**
   - DNS propagation can take a few minutes to 48 hours
   - Resend will automatically verify your domain once the DNS records are detected
   - You'll see a green checkmark when verified

### Step 2: Update Your Environment Variables

Once your domain is verified:

1. **Set RESEND_FROM_EMAIL:**
   ```env
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```
   Or use any email address using your verified domain:
   ```env
   RESEND_FROM_EMAIL=contact@yourdomain.com
   RESEND_FROM_EMAIL=hello@yourdomain.com
   ```

2. **Update on Render:**
   - Go to your Render dashboard
   - Navigate to your backend service
   - Go to "Environment" tab
   - Add or update `RESEND_FROM_EMAIL` with your verified domain email
   - Redeploy your service

3. **For Local Development:**
   - Update `backend/.env` file:
     ```env
     RESEND_FROM_EMAIL=noreply@yourdomain.com
     ```

### Step 3: Test

After updating the environment variable and redeploying:

1. Try sending a test email through your contact form
2. The email should now be sent from your verified domain
3. You can send to any recipient, not just your account email

## Quick Reference

- **Resend Domains Dashboard:** https://resend.com/domains
- **Resend Documentation:** https://resend.com/docs
- **DNS Propagation Checker:** https://www.whatsmydns.net/

## Common Domain Providers

### Cloudflare
1. Log in → Select your domain
2. Go to "DNS" → "Records"
3. Click "Add record"
4. Select "TXT" type
5. Paste the record from Resend

### GoDaddy
1. Log in → My Products
2. Click "DNS" next to your domain
3. Scroll to "Records" section
4. Click "Add" → Select "TXT"
5. Paste the record from Resend

### Namecheap
1. Log in → Domain List
2. Click "Manage" next to your domain
3. Go to "Advanced DNS" tab
4. Click "Add New Record"
5. Select "TXT Record"
6. Paste the record from Resend

## Troubleshooting

- **Domain not verifying?**
  - Wait 24-48 hours for DNS propagation
  - Double-check that DNS records are exactly as provided by Resend
  - Use a DNS checker tool to verify records are live

- **Still getting testing email error?**
  - Make sure `RESEND_FROM_EMAIL` uses your verified domain
  - Ensure the service has been redeployed after updating environment variables
  - Check that the domain shows as "Verified" in Resend dashboard

- **Don't have a domain?**
  - You can purchase one from providers like:
    - Namecheap (~$10-15/year)
    - Google Domains (~$12/year)
    - Cloudflare (~$8-10/year)
  - Or use a subdomain if you have access to a parent domain

## Alternative: Use Resend's Testing Mode (Limited)

If you only need to test with your own email (`tiffianhub@gmail.com`), you can continue using `onboarding@resend.dev` without verification. However, this won't work for production use where you need to send to other users.

