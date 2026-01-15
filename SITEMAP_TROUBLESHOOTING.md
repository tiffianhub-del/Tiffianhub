# Sitemap Troubleshooting Guide

## "General HTTP error" in Google Search Console

This error means Google cannot access your sitemap at the URL you provided.

## Quick Checks:

### 1. **Verify the Sitemap is Accessible**
After deployment, test these URLs in your browser:
- `https://freshillymeal.com/sitemap.xml` ✅ Should show XML
- `https://freshillymeal.com/robots.txt` ✅ Should show robots.txt

### 2. **Check the URL You Submitted**
In Google Search Console, make sure you submitted:
- ✅ `https://freshillymeal.com/sitemap.xml` (correct)
- ❌ `http://freshillymeal.com/sitemap.xml` (wrong - no SSL)
- ❌ `https://www.freshillymeal.com/sitemap.xml` (wrong - if www not configured)
- ❌ `freshillymeal.com/sitemap.xml` (wrong - missing protocol)

### 3. **Verify Deployment**
- ✅ Is your latest code deployed?
- ✅ Did the build complete successfully?
- ✅ Is your site accessible at `https://freshillymeal.com`?

### 4. **Check Build Logs**
Look for errors during the build process. The sitemap should be generated during build.

### 5. **Test Locally First**
```bash
npm run build
npm start
```
Then visit: `http://localhost:3000/sitemap.xml`

If it works locally but not in production, it's a deployment issue.

## Common Issues & Solutions:

### Issue 1: Site Not Deployed Yet
**Solution:** Deploy your latest code with the sitemap.js file

### Issue 2: Wrong URL Submitted
**Solution:** Make sure you're using `https://freshillymeal.com/sitemap.xml` (exact match)

### Issue 3: Site Not Accessible
**Solution:** 
- Check if `https://freshillymeal.com` loads in your browser
- Verify DNS is pointing correctly
- Check SSL certificate is valid

### Issue 4: Build Error
**Solution:** 
- Check deployment logs for errors
- Ensure Next.js version supports sitemap.js (Next.js 13+)
- Verify all dependencies are installed

### Issue 5: Route Not Generated
**Solution:**
- The sitemap.js file must be in the `app/` directory
- File must be named exactly `sitemap.js` (not `sitemap.ts` or `sitemap.jsx`)
- Must export a default function

## Verification Steps:

1. **Deploy the code** with sitemap.js
2. **Wait 5-10 minutes** after deployment
3. **Test the URL**: Visit `https://freshillymeal.com/sitemap.xml` in browser
4. **If it works**: Resubmit in Google Search Console
5. **If it doesn't work**: Check deployment logs and site accessibility

## Expected Sitemap Output:

When you visit `https://freshillymeal.com/sitemap.xml`, you should see XML like:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://freshillymeal.com</loc>
    <lastmod>2024-01-01T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  ...
</urlset>
```

If you see this XML, the sitemap is working correctly!

