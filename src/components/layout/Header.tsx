import Link from "next/link";
import { getCategories } from "@/lib/data/taxonomy";
import { HeadlineTicker } from "@/components/layout/HeadlineTicker";
import { SearchBar } from "@/components/layout/SearchBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { formatDate } from "@/lib/utils/format";

export async function Header() {
  const categories = await getCategories();
  const today = formatDate(new Date());

  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur dark:bg-surface-dark/95">
      <HeadlineTicker />
      <div className="container-page flex h-16 items-center justify-between gap-4 border-b border-line dark:border-line-dark">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold tracking-tight text-ink dark:text-paper">
            Zet<span className="text-accent">Play</span>
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            News
          </span>
        </Link>

        <div className="hidden font-mono text-xs text-muted lg:block">{today}</div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          <MobileMenu categories={categories} />
        </div>
      </div>
      <nav className="container-page hidden h-11 items-center gap-6 overflow-x-auto border-b border-line dark:border-line-dark lg:flex">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/kategoriya/${category.slug}`}
            className="whitespace-nowrap text-sm font-medium text-ink/80 transition hover:text-accent dark:text-paper/80"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
