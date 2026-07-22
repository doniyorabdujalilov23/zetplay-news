import type { Metadata } from "next";
import { searchArticles } from "@/lib/data/articles";
import { NewsCard } from "@/components/news/NewsCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchPageForm } from "@/components/news/SearchPageForm";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" bo'yicha qidiruv natijalari` : "Qidiruv",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? await searchArticles(query, 30) : [];

  return (
    <div className="container-page py-6">
      <Breadcrumb items={[{ label: "Qidiruv" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Qidiruv</h1>

      <div className="mt-6 max-w-xl">
        <SearchPageForm initialQuery={query} />
      </div>

      {query && (
        <p className="mt-6 text-sm text-muted">
          <strong className="text-ink dark:text-paper">{results.length}</strong> ta natija topildi
          &mdash; &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {query && results.length === 0 && (
        <p className="py-16 text-center text-muted">
          &ldquo;{query}&rdquo; bo'yicha hech qanday yangilik topilmadi.
        </p>
      )}
    </div>
  );
}
