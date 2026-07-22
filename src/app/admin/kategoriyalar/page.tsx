"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import { getCategories } from "@/lib/data/taxonomy";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getNextCategoryOrder,
} from "@/lib/data/admin-taxonomy";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const order = await getNextCategoryOrder();
      await createCategory(name, order, description);
      setName("");
      setDescription("");
      toast.success("Kategoriya yaratildi");
      load();
    } catch {
      toast.error("Kategoriya yaratishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const saveEdit = async (category: Category) => {
    try {
      await updateCategory(category.id, editName, category.order, editDescription);
      toast.success("Kategoriya yangilandi");
      setEditingId(null);
      load();
    } catch {
      toast.error("Yangilashda xatolik");
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`"${category.name}" kategoriyasini o'chirasizmi?`)) return;
    try {
      await deleteCategory(category.id);
      toast.success("Kategoriya o'chirildi");
      load();
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Kategoriyalar</h1>
      <p className="mt-1 text-sm text-muted">Yangiliklar bo'limlarini boshqarish</p>

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap gap-3 rounded-xl border border-line p-4 dark:border-line-dark">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kategoriya nomi"
          className="min-w-[180px] flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tavsif (ixtiyoriy)"
          className="min-w-[220px] flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {submitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Qo'shish
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-line dark:border-line-dark">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={22} />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-paper-dim text-left text-xs uppercase tracking-wide text-muted dark:bg-surface-dark-card">
              <tr>
                <th className="px-4 py-3">Nomi</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Tavsif</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark">
              {categories.map((category) => (
                <tr key={category.id}>
                  {editingId === category.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-line bg-transparent px-2 py-1 text-sm outline-none focus:border-accent dark:border-line-dark"
                        />
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-muted">{category.slug}</td>
                      <td className="px-4 py-2">
                        <input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full rounded border border-line bg-transparent px-2 py-1 text-sm outline-none focus:border-accent dark:border-line-dark"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => saveEdit(category)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-emerald-600 dark:border-line-dark"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-line dark:border-line-dark"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{category.slug}</td>
                      <td className="px-4 py-3 text-muted">{category.description || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(category)}
                            aria-label="Tahrirlash"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            aria-label="O'chirish"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition hover:border-red-500 hover:text-red-500 dark:border-line-dark dark:text-paper"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
