import { queryAll } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://www.7shop-megamall.com';
  
  // Get top 20 categories for sitemap
  let categories = [];
  try {
    categories = await queryAll(`SELECT category FROM products GROUP BY category ORDER BY COUNT(*) DESC LIMIT 20`);
  } catch (e) {
    console.error(e);
  }

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/category/${encodeURIComponent(c.category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best-sellers`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...categoryUrls,
  ];
}
