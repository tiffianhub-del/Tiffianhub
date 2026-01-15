export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshillymeal.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/dashboard/',
          '/list/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

