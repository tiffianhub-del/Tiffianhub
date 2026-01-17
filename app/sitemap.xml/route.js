import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache the sitemap content in memory to avoid file I/O on every request
let cachedSitemap = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function getSitemapContent() {
  const now = Date.now();
  
  // Return cached content if still valid
  if (cachedSitemap && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSitemap;
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn('Sitemap file not found, generating fallback...');
      // Fallback: generate on-the-fly if file doesn't exist
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshillymeal.com';
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');
      
      const routes = [
        {
          url: cleanBaseUrl,
          lastModified: new Date().toISOString(),
          changeFrequency: 'daily',
          priority: 1.0,
        },
        {
          url: `${cleanBaseUrl}/about`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${cleanBaseUrl}/help`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly',
          priority: 0.7,
        },
        {
          url: `${cleanBaseUrl}/privacy`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'yearly',
          priority: 0.5,
        },
        {
          url: `${cleanBaseUrl}/terms`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'yearly',
          priority: 0.5,
        },
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

      // Cache the fallback sitemap
      cachedSitemap = sitemap;
      cacheTimestamp = now;
      
      return sitemap;
    }

    // Read file asynchronously to avoid blocking
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    
    // Cache the file content
    cachedSitemap = fileContents;
    cacheTimestamp = now;
    
    return fileContents;
  } catch (error) {
    console.error('Error reading sitemap:', error);
    // Return cached content if available, even if expired
    if (cachedSitemap) {
      return cachedSitemap;
    }
    throw error;
  }
}

function getCacheHeaders(userAgent) {
  const isGooglebot = userAgent?.includes('Googlebot') || 
                      userAgent?.includes('Google-InspectionTool');

  // Aggressive caching for Googlebot to reduce server load and ModSecurity triggers
  const cacheControl = isGooglebot
    ? 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' // 24 hours for Googlebot
    : 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'; // 1 hour for others

  return {
    'Content-Type': 'application/xml',
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
  };
}

// Handle HEAD requests (Googlebot uses this first!)
export async function HEAD(request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const headers = getCacheHeaders(userAgent);
    
    // For HEAD, we don't need the body, just the headers
    return new NextResponse(null, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error handling HEAD request:', error);
    return new NextResponse(null, { status: 404 });
  }
}

// Handle GET requests
export async function GET(request) {
  try {
    const sitemapContent = await getSitemapContent();
    const userAgent = request.headers.get('user-agent') || '';
    const headers = getCacheHeaders(userAgent);

    return new NextResponse(sitemapContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error reading sitemap:', error);
    return new NextResponse('Sitemap not found', { status: 404 });
  }
}
