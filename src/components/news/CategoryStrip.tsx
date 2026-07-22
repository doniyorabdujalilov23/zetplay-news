import Link from "next/link";
import type { Category } from "@/types";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/kategoriya/${category.slug}`}
          className="whitespace-nowrap rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink transition hover:border-accent hover:bg-accent hover:text-white dark:border-line-dark dark:text-paper"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
