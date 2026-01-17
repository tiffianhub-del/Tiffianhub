const fs = require('fs');
const path = require('path');

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

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated successfully at public/sitemap.xml');
