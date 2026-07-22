import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/data/articles";
import { getCategories, getTags } from "@/lib/data/taxonomy";
import { SITE_CONFIG } from "@/lib/constants";
import { toDate } from "@/lib/utils/format";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories, tags] = await Promise.all([
    getAllPublishedSlugs(),
    getCategories(),
    getTags(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, changeFrequency: "always", priority: 1 },
    { url: `${SITE_CONFIG.url}/qidiruv`, changeFrequency: "weekly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_CONFIG.url}/kategoriya/${category.slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_CONFIG.url}/teg/${tag.slug}`,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  const articlePages: MetadataRoute.Sitemap = slugs.map(({ slug, updatedAt }) => ({
    url: `${SITE_CONFIG.url}/yangilik/${slug}`,
    lastModified: toDate(updatedAt) || new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...tagPages, ...articlePages];
}
