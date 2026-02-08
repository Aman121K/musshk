import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/account', '/login', '/register', '/order-success'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/checkout', '/account', '/login', '/register', '/order-success'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/checkout', '/account', '/login', '/register', '/order-success'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
