"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getAdminArticles, deleteArticle } from "@/lib/data/admin-articles";
import { formatDate, formatCompactNumber } from "@/lib/utils/format";
import type { Article, ArticleStatus } from "@/types";

const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "Qoralama",
  published: "Chop etilgan",
  scheduled: "Rejalashtirilgan",
};

const STATUS_STYLES: Record<ArticleStatus, string> = {
  draft: "bg-muted/10 text-muted",
  published: "bg-emerald-500/10 text-emerald-600",
  scheduled: "bg-amber-500/10 text-amber-600",
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = () => {
    setLoading(true);
    getAdminArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (article: Article) => {
    if (!window.confirm(`"${article.title}" maqolasini o'chirishga ishonchingiz komilmi?`)) return;
    setDeletingId(article.id);
    try {
      await deleteArticle(article);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
      toast.success("Maqola o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = articles.filter((article) => {
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Yangiliklar</h1>
          <p className="mt-1 text-sm text-muted">Barcha maqolalarni boshqarish</p>
        </div>
        <Link
          href="/admin/maqolalar/yangi"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          <Plus size={16} /> Yangi maqola
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sarlavha bo'yicha qidirish..."
            className="w-full rounded-lg border border-line bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "published", "draft", "scheduled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === status
                  ? "bg-accent text-white"
                  : "border border-line text-muted hover:border-accent hover:text-accent dark:border-line-dark"
              }`}
            >
              {status === "all" ? "Barchasi" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line dark:border-line-dark">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-paper-dim text-left text-xs uppercase tracking-wide text-muted dark:bg-surface-dark-card">
              <tr>
                <th className="px-4 py-3">Maqola</th>
                <th className="px-4 py-3">Kategoriya</th>
                <th className="px-4 py-3">Holat</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3">Ko'rishlar</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark">
              {filtered.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-line dark:bg-line-dark">
                        {article.coverImage && (
                          <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
                        )}
                      </div>
                      <span className="line-clamp-2 font-medium">{article.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{article.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[article.status]}`}>
                      {STATUS_LABELS[article.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(article.createdAt)}</td>
                  <td className="px-4 py-3 text-muted">{formatCompactNumber(article.views)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/maqolalar/${article.id}`}
                        aria-label="Tahrirlash"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article)}
                        disabled={deletingId === article.id}
                        aria-label="O'chirish"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition hover:border-red-500 hover:text-red-500 disabled:opacity-50 dark:border-line-dark dark:text-paper"
                      >
                        {deletingId === article.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">Hech qanday maqola topilmadi.</p>
        )}
      </div>
    </div>
  );
}
