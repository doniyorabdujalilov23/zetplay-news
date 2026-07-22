import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug } from "@/lib/data/taxonomy";
import { getPublishedArticles } from "@/lib/data/articles";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InfiniteArticleGrid } from "@/components/news/InfiniteArticleGrid";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return {};
  return {
    title: `#${tag.name} tegi bo'yicha yangiliklar`,
    alternates: { canonical: `/teg/${tag.slug}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const articles = await getPublishedArticles({ tagSlug: slug, pageSize: 12 });

  return (
    <div className="container-page py-6">
      <Breadcrumb items={[{ label: `#${tag.name}` }]} />
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">#{tag.name}</h1>

      <div className="mt-8">
        <InfiniteArticleGrid
          initialArticles={articles.items}
          initialCursor={articles.lastCursor}
          initialHasMore={articles.hasMore}
          tagSlug={slug}
        />
      </div>
    </div>
  );
}
