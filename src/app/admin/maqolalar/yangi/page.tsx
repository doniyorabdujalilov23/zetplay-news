"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getCategories } from "@/lib/data/taxonomy";
import { getTags } from "@/lib/data/taxonomy";
import type { Category, Tag } from "@/types";

export default function NewArticlePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCategories(), getTags()])
      .then(([cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Link href="/admin/maqolalar" className="flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        <ArrowLeft size={15} /> Yangiliklarga qaytish
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold">Yangi maqola qo'shish</h1>

      <div className="mt-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : categories.length === 0 ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700">
            Avval kamida bitta kategoriya yarating (Kategoriyalar bo'limidan).
          </p>
        ) : (
          <ArticleEditor categories={categories} tags={tags} />
        )}
      </div>
    </div>
  );
}
