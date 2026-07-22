"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getAdminArticleById } from "@/lib/data/admin-articles";
import { getCategories, getTags } from "@/lib/data/taxonomy";
import type { Article, Category, Tag } from "@/types";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([getAdminArticleById(params.id), getCategories(), getTags()])
      .then(([art, cats, tgs]) => {
        if (!art) {
          setNotFound(true);
          return;
        }
        setArticle(art);
        setCategories(cats);
        setTags(tgs);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <Link href="/admin/maqolalar" className="flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        <ArrowLeft size={15} /> Yangiliklarga qaytish
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold">Maqolani tahrirlash</h1>

      <div className="mt-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : notFound ? (
          <p className="text-sm text-muted">Maqola topilmadi.</p>
        ) : (
          <ArticleEditor article={article} categories={categories} tags={tags} />
        )}
      </div>
    </div>
  );
}
