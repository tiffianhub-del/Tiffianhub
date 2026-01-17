export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshillymeal.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/sitemap.xml',  // Explicitly allow sitemap for Googlebot
        ],
     
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

