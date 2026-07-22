import Link from "next/link";
import type { Article } from "@/types";
import { formatCompactNumber } from "@/lib/utils/format";

export function PopularList({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <div className="rounded-xl border border-line p-5 dark:border-line-dark">
      <h3 className="eyebrow mb-4">Mashhur yangiliklar</h3>
      <ol className="space-y-4">
        {articles.map((article, idx) => (
          <li key={article.id}>
            <Link href={`/yangilik/${article.slug}`} className="group flex gap-3">
              <span className="font-display text-2xl font-bold text-line group-hover:text-accent dark:text-line-dark">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-accent">
                  {article.title}
                </h4>
                <span className="font-mono text-[11px] text-muted">
                  {formatCompactNumber(article.views)} o'qilgan
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
