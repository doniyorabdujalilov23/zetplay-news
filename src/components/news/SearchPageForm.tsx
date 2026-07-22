"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchPageForm({ initialQuery }: { initialQuery: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/qidiruv?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Sarlavha, matn yoki teg bo'yicha qidiring..."
        className="w-full rounded-full border border-line bg-transparent py-3 pl-5 pr-12 text-sm outline-none transition focus:border-accent dark:border-line-dark"
      />
      <button
        type="submit"
        aria-label="Qidirish"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white"
      >
        <Search size={15} />
      </button>
    </form>
  );
}
