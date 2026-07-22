"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Article } from "@/types";
import { formatRelativeTime, formatCompactNumber } from "@/lib/utils/format";

export function FeaturedSlider({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (nextIndex: number, dir: number) => {
      setDirection(dir);
      setIndex((nextIndex + articles.length) % articles.length);
    },
    [articles.length]
  );

  useEffect(() => {
    if (articles.length < 2) return;
    const timer = setInterval(() => goTo(index + 1, 1), 6000);
    return () => clearInterval(timer);
  }, [index, articles.length, goTo]);

  if (!articles.length) return null;
  const current = articles[index]!;

  return (
    <div className="relative overflow-hidden rounded-xl bg-ink">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Link href={`/yangilik/${current.slug}`} className="block h-full w-full">
              <Image
                src={current.coverImage}
                alt={current.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
                <span className="inline-block rounded-full bg-accent px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-white">
                  {current.categoryName}
                </span>
                <h2 className="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight text-white sm:text-4xl">
                  {current.title}
                </h2>
                <p className="mt-3 hidden max-w-2xl text-sm text-white/80 sm:block">
                  {current.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 font-mono text-xs text-white/70">
                  <span>{formatRelativeTime(current.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {formatCompactNumber(current.views)}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Oldingi"
            onClick={() => goTo(index - 1, -1)}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Keyingi"
            onClick={() => goTo(index + 1, 1)}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {articles.map((item, i) => (
              <button
                key={item.id}
                aria-label={`${i + 1}-slayd`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
