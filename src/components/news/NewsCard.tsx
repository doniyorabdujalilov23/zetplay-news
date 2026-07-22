import Link from "next/link";
import Image from "next/image";
import { Eye, Clock } from "lucide-react";
import type { Article } from "@/types";
import { formatRelativeTime, formatCompactNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "horizontal" | "compact" | "large";
  priority?: boolean;
}

export function NewsCard({ article, variant = "default", priority = false }: NewsCardProps) {
  const href = `/yangilik/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-3">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-line dark:bg-line-dark">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="96px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="eyebrow">{article.categoryName}</span>
          <h4 className="mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-snug transition group-hover:text-accent">
            {article.title}
          </h4>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group flex gap-4 border-b border-line pb-4 dark:border-line-dark">
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg bg-line sm:w-40 dark:bg-line-dark">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="160px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="eyebrow">{article.categoryName}</span>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug transition group-hover:text-accent sm:text-lg">
            {article.title}
          </h3>
          <p className="mt-1 hidden line-clamp-2 text-sm text-muted sm:block">{article.excerpt}</p>
          <div className="mt-auto flex items-center gap-3 pt-2 font-mono text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {formatRelativeTime(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} /> {formatCompactNumber(article.views)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-line dark:bg-line-dark">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <span className="inline-block rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-white">
              {article.categoryName}
            </span>
            <h2 className="mt-3 font-display text-xl font-bold leading-tight text-white sm:text-3xl">
              {article.title}
            </h2>
            <div className="mt-3 flex items-center gap-3 font-mono text-xs text-white/80">
              <span>{formatRelativeTime(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {formatCompactNumber(article.views)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group flex flex-col">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-line dark:bg-line-dark">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn("object-cover transition duration-300 group-hover:scale-105")}
        />
        {article.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white">
            Tavsiya
          </span>
        )}
      </div>
      <span className="eyebrow mt-3">{article.categoryName}</span>
      <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug transition group-hover:text-accent">
        {article.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
      <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {formatRelativeTime(article.publishedAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={11} /> {formatCompactNumber(article.views)}
        </span>
      </div>
    </Link>
  );
}
