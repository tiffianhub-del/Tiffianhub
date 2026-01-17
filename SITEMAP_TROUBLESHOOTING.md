# Sitemap Troubleshooting Guide

## "General HTTP error" in Google Search Console

This error means Google cannot access your sitemap at the URL you provided.

## ⚠️ Namecheap ModSecurity / Rate-Limit Issue (FIXED)

**Problem:** Namecheap hosting + Next.js apps often trigger ModSecurity/rate-limit rules when:
- Googlebot fetches `/sitemap.xml`
- The sitemap is generated dynamically (API route or server-side)
- Multiple fast requests come from Google IPs
- **Googlebot uses HEAD requests first** (browsers use GET)
- Namecheap then returns a 403/503 briefly, which Google reports as "Sitemap could not be read – General HTTP error"

**Root Cause:** Google Search Console uses **HEAD requests** to check sitemaps before fetching with GET. If HEAD requests fail or are blocked, Google reports "General HTTP error" even though the sitemap file is correct.

**Solution Implemented:** 
- ✅ Sitemap is now **pre-generated at build time** as a static file (`public/sitemap.xml`)
- ✅ Route handler (`app/sitemap.xml/route.js`) serves the static file with aggressive caching headers
- ✅ **HEAD method handler added** - Googlebot's HEAD requests now work correctly
- ✅ Special caching for Googlebot (24 hours) to reduce server load
- ✅ `.htaccess` file created to allow HEAD requests at Apache level
- ✅ No server-side processing = No ModSecurity triggers

The sitemap is automatically generated before each build via the `prebuild` script.

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
- The sitemap is now generated statically at build time
- Check that `scripts/generate-sitemap.js` exists and runs during `prebuild`
- Verify `app/sitemap.xml/route.js` exists to serve the static file
- The old `app/sitemap.js` is kept as a fallback but the route handler takes precedence

### Issue 6: ModSecurity / Rate-Limit Errors (Namecheap)
**Solution:**
- ✅ **FIXED**: Sitemap is now pre-generated at build time (no server-side processing)
- ✅ Route handler serves static file with proper caching headers
- ✅ **HEAD method handler added** - Googlebot's HEAD requests now work correctly
- ✅ `.htaccess` file allows HEAD requests at Apache level
- ✅ Googlebot gets 24-hour cache to reduce request frequency
- If issues persist, contact Namecheap support to whitelist Googlebot IPs

### Issue 7: "General HTTP error" - HEAD Request Failure
**Root Cause:** Googlebot uses HEAD requests first, then GET. If HEAD fails, Search Console shows "General HTTP error" even if GET works.

**Solution:**
- ✅ **FIXED**: Added `HEAD` method handler to `app/sitemap.xml/route.js`
- ✅ `.htaccess` file ensures HEAD requests are allowed
- ✅ Test with: `curl -I https://freshillymeal.com/sitemap.xml` (should return 200 OK)

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

