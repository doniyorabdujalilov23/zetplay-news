"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Send, CalendarClock, Star, Loader2 } from "lucide-react";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { TagMultiSelect } from "@/components/admin/TagMultiSelect";
import { useAuth } from "@/context/AuthContext";
import { createArticle, updateArticle } from "@/lib/data/admin-articles";
import { createTag } from "@/lib/data/admin-taxonomy";
import { slugify } from "@/lib/utils/slug";
import type { Article, ArticleFormInput, Category, GalleryImage, Tag } from "@/types";

interface ArticleEditorProps {
  article?: Article | null;
  categories: Category[];
  tags: Tag[];
}

const emptyForm: ArticleFormInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverImagePath: "",
  gallery: [],
  youtubeUrl: "",
  categoryId: "",
  tagIds: [],
  status: "draft",
  featured: false,
  scheduledAt: null,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
};

export function ArticleEditor({ article, categories, tags }: ArticleEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);
  const [form, setForm] = useState<ArticleFormInput>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seoKeywordsInput, setSeoKeywordsInput] = useState("");

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        coverImagePath: article.coverImagePath || "",
        gallery: article.gallery,
        youtubeUrl: article.youtubeUrl || "",
        categoryId: article.categoryId,
        tagIds: article.tagIds,
        status: article.status,
        featured: article.featured,
        scheduledAt: null,
        seoTitle: article.seoTitle || "",
        seoDescription: article.seoDescription || "",
        seoKeywords: article.seoKeywords || [],
      });
      setSeoKeywordsInput((article.seoKeywords || []).join(", "));
      setSlugTouched(true);
    } else if (categories.length && !form.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: categories[0]!.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, categories]);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  };

  const handleCreateTag = async (name: string): Promise<Tag> => {
    await createTag(name);
    const newTag: Tag = { id: slugify(name), name, slug: slugify(name), createdAt: new Date() };
    setAvailableTags((prev) => [...prev, newTag]);
    return newTag;
  };

  const validate = (): boolean => {
    if (!form.title.trim()) return toast.error("Sarlavhani kiriting"), false;
    if (!form.excerpt.trim()) return toast.error("Qisqa tavsifni kiriting"), false;
    if (!form.content.trim() || form.content === "<p></p>")
      return toast.error("Maqola matnini kiriting"), false;
    if (!form.coverImage) return toast.error("Asosiy rasmni yuklang"), false;
    if (!form.categoryId) return toast.error("Kategoriyani tanlang"), false;
    return true;
  };

  const handleSave = async (status: ArticleFormInput["status"]) => {
    if (!validate() || !user) return;
    setSaving(true);

    const category = categories.find((c) => c.id === form.categoryId)!;
    const selectedTags = availableTags.filter((t) => form.tagIds.includes(t.id));
    const keywords = seoKeywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payload: ArticleFormInput = { ...form, status, seoKeywords: keywords };

    try {
      if (article) {
        await updateArticle(article.id, payload, category, selectedTags);
        toast.success("Maqola yangilandi");
      } else {
        await createArticle(payload, category, selectedTags, {
          uid: user.uid,
          name: user.displayName || user.email || "Admin",
          photoURL: user.photoURL,
        });
        toast.success(
          status === "published"
            ? "Maqola chop etildi"
            : status === "scheduled"
              ? "Maqola rejalashtirildi"
              : "Qoralama saqlandi"
        );
      }
      router.push("/admin/maqolalar");
      router.refresh();
    } catch {
      toast.error("Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Sarlavha</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Maqola sarlavhasi"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2.5 font-display text-lg font-semibold outline-none focus:border-accent dark:border-line-dark"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">URL Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
            }}
            placeholder="avtomatik-yaratiladi"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Qisqa tavsif</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            placeholder="Maqola haqida qisqacha ma'lumot (ro'yxatlarda ko'rsatiladi)"
            className="w-full resize-none rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">To'liq matn</label>
          <TiptapEditor content={form.content} onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
        </div>

        <ImageUploader
          value={form.coverImage}
          onChange={({ url, path }) => setForm((prev) => ({ ...prev, coverImage: url, coverImagePath: path }))}
        />

        <GalleryUploader
          images={form.gallery}
          onChange={(gallery: GalleryImage[]) => setForm((prev) => ({ ...prev, gallery }))}
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">YouTube video havolasi (ixtiyoriy)</label>
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          />
        </div>

        <div className="rounded-xl border border-line p-4 dark:border-line-dark">
          <h3 className="font-display text-sm font-bold">SEO sozlamalari</h3>
          <div className="mt-3 space-y-3">
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="SEO Title (bo'sh bo'lsa sarlavha ishlatiladi)"
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
            />
            <textarea
              value={form.seoDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
              rows={2}
              placeholder="SEO Description (bo'sh bo'lsa qisqa tavsif ishlatiladi)"
              className="w-full resize-none rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
            />
            <input
              type="text"
              value={seoKeywordsInput}
              onChange={(e) => setSeoKeywordsInput(e.target.value)}
              placeholder="Kalit so'zlar (vergul bilan ajrating)"
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-line p-4 dark:border-line-dark">
          <h3 className="font-display text-sm font-bold">Nashr etish</h3>
          <div className="mt-3 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Rejalashtirish sanasi</label>
              <input
                type="datetime-local"
                value={form.scheduledAt || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 rounded accent-accent"
              />
              <Star size={14} /> Tavsiya etilgan (Featured)
            </label>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave("draft")}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent disabled:opacity-60 dark:border-line-dark"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Qoralama sifatida saqlash
              </button>
              {form.scheduledAt ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave("scheduled")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink/80 disabled:opacity-60 dark:bg-paper dark:text-ink"
                >
                  <CalendarClock size={15} />
                  Rejalashtirish
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave("published")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
                >
                  <Send size={15} />
                  Chop etish
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line p-4 dark:border-line-dark">
          <h3 className="font-display text-sm font-bold">Kategoriya</h3>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
            className="mt-3 w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-line p-4 dark:border-line-dark">
          <TagMultiSelect
            allTags={availableTags}
            selectedIds={form.tagIds}
            onChange={(tagIds) => setForm((prev) => ({ ...prev, tagIds }))}
            onCreateTag={handleCreateTag}
          />
        </div>
      </div>
    </div>
  );
}
