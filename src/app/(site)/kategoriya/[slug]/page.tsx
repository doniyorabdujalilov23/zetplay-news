import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/data/taxonomy";
import { getPublishedArticles } from "@/lib/data/articles";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { InfiniteArticleGrid } from "@/components/news/InfiniteArticleGrid";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} yangiliklari`;
  const description =
    category.description ||
    `${category.name} bo'yicha eng so'nggi va tezkor yangiliklar — ${SITE_CONFIG.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/kategoriya/${category.slug}` },
    openGraph: { title, description, url: `${SITE_CONFIG.url}/kategoriya/${category.slug}` },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getPublishedArticles({ categorySlug: slug, pageSize: 12 });

  return (
    <div className="container-page py-6">
      <Breadcrumb items={[{ label: category.name }]} />
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
      {category.description && <p className="mt-2 max-w-2xl text-muted">{category.description}</p>}

      <div className="mt-8">
        <InfiniteArticleGrid
          initialArticles={articles.items}
          initialCursor={articles.lastCursor}
          initialHasMore={articles.hasMore}
          categorySlug={slug}
        />
      </div>
    </div>
  );
}
