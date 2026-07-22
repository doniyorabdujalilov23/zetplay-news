"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsCardSkeleton } from "@/components/skeletons/Skeletons";
import { getPublishedArticles } from "@/lib/data/articles";
import type { Article } from "@/types";

interface InfiniteArticleGridProps {
  initialArticles: Article[];
  initialCursor: string | null;
  initialHasMore: boolean;
  categorySlug?: string;
  tagSlug?: string;
}

export function InfiniteArticleGrid({
  initialArticles,
  initialCursor,
  initialHasMore,
  categorySlug,
  tagSlug,
}: InfiniteArticleGridProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);
    try {
      const result = await getPublishedArticles({ categorySlug, tagSlug, cursor });
      setArticles((prev) => [...prev, ...result.items]);
      setCursor(result.lastCursor);
      setHasMore(result.hasMore);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, categorySlug, tagSlug]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={`loading-${i}`} />)}
      </div>
      {hasMore ? (
        <div ref={sentinelRef} className="h-10 w-full" />
      ) : (
        articles.length > 0 && (
          <p className="mt-10 text-center font-mono text-xs uppercase tracking-widest text-muted">
            Boshqa yangilik yo'q
          </p>
        )
      )}
      {articles.length === 0 && !loading && (
        <p className="py-20 text-center text-muted">Ushbu bo'limda hozircha yangilik yo'q.</p>
      )}
    </div>
  );
}
