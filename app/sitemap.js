import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshillymeal.com';
  
  // Ensure baseUrl doesn't have trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  
  // Static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${cleanBaseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${cleanBaseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${cleanBaseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${cleanBaseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return routes;
}

