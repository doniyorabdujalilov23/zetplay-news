import type { Article } from "@/types";
import { NewsCard } from "@/components/news/NewsCard";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="mt-12 border-t border-line pt-8 dark:border-line-dark">
      <h2 className="font-display text-xl font-bold">O'xshash yangiliklar</h2>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
