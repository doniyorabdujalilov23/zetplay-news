import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";
import { slugify } from "@/lib/utils/slug";

export function TagList({ tagNames }: { tagNames: string[] }) {
  if (!tagNames.length) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <TagIcon size={14} className="text-muted" />
      {tagNames.map((tag) => (
        <Link
          key={tag}
          href={`/teg/${slugify(tag)}`}
          className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition hover:border-accent hover:text-accent dark:border-line-dark"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
