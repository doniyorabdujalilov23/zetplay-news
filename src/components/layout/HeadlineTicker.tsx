import Link from "next/link";
import { getPublishedArticles } from "@/lib/data/articles";

export async function HeadlineTicker() {
  const { items } = await getPublishedArticles({ pageSize: 10 });
  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-line bg-ink text-paper dark:border-line-dark dark:bg-surface-dark-card">
      <div className="flex items-center">
        <span className="z-10 flex shrink-0 items-center gap-2 bg-accent px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Tezkor
        </span>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap py-1.5 hover:[animation-play-state:paused]">
            {doubled.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={`/yangilik/${item.slug}`}
                className="mx-4 shrink-0 font-mono text-xs text-paper/90 transition hover:text-accent"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
