import type { Metadata } from "next";
import {
  getFeaturedArticles,
  getPopularArticles,
  getPublishedArticles,
} from "@/lib/data/articles";
import { getCategories } from "@/lib/data/taxonomy";
import { getSiteSettings } from "@/lib/data/settings";
import { FeaturedSlider } from "@/components/news/FeaturedSlider";
import { CategoryStrip } from "@/components/news/CategoryStrip";
import { PopularList } from "@/components/news/PopularList";
import { InfiniteArticleGrid } from "@/components/news/InfiniteArticleGrid";
import { NewsCard } from "@/components/news/NewsCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { SITE_CONFIG, FEATURED_SLIDER_COUNT, POPULAR_ARTICLES_COUNT } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Tezkor va ishonchli yangiliklar`,
  description: SITE_CONFIG.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, popular, latest, categories, settings] = await Promise.all([
    getFeaturedArticles(FEATURED_SLIDER_COUNT),
    getPopularArticles(POPULAR_ARTICLES_COUNT),
    getPublishedArticles({ pageSize: 12 }),
    getCategories(),
    getSiteSettings(),
  ]);

  const [heroArticle, ...recommendedArticles] = latest.items;

  return (
    <div className="container-page py-6">
      <section className="mb-8">
        <FeaturedSlider articles={featured.length ? featured : latest.items.slice(0, 5)} />
      </section>

      <section className="mb-8">
        <CategoryStrip categories={categories} />
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {heroArticle && (
            <section className="mb-10">
              <h2 className="eyebrow mb-4">Tavsiya etilgan yangilik</h2>
              <NewsCard article={heroArticle} variant="large" priority />
            </section>
          )}

          <section className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Eng so'nggi yangiliklar</h2>
          </section>
          <InfiniteArticleGrid
            initialArticles={recommendedArticles.length ? recommendedArticles : latest.items}
            initialCursor={latest.lastCursor}
            initialHasMore={latest.hasMore}
          />
        </div>

        <aside className="space-y-8">
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
          <PopularList articles={popular} />
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
        </aside>
      </div>
    </div>
  );
}
