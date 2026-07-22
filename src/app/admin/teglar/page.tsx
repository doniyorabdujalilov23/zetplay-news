"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { getTags } from "@/lib/data/taxonomy";
import { createTag, updateTag, deleteTag } from "@/lib/data/admin-taxonomy";
import type { Tag } from "@/types";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = () => {
    setLoading(true);
    getTags()
      .then(setTags)
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
      await createTag(name);
      setName("");
      toast.success("Teg qo'shildi");
      load();
    } catch {
      toast.error("Teg qo'shishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!window.confirm(`#${tag.name} tegini o'chirasizmi?`)) return;
    try {
      await deleteTag(tag.id);
      toast.success("Teg o'chirildi");
      load();
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const saveEdit = async (tag: Tag) => {
    try {
      await updateTag(tag.id, editName);
      setEditingId(null);
      toast.success("Teg yangilandi");
      load();
    } catch {
      toast.error("Yangilashda xatolik");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Teglar</h1>
      <p className="mt-1 text-sm text-muted">Maqolalar uchun teglarni boshqarish</p>

      <form onSubmit={handleCreate} className="mt-6 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yangi teg nomi"
          className="min-w-[200px] flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-line-dark"
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

      {loading ? (
        <div className="mt-8 flex h-32 items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={22} />
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) =>
            editingId === tag.id ? (
              <div key={tag.id} className="flex items-center gap-1 rounded-full border border-accent px-2 py-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-24 bg-transparent text-xs outline-none"
                />
                <button onClick={() => saveEdit(tag)} aria-label="Saqlash">
                  <Check size={13} className="text-emerald-600" />
                </button>
                <button onClick={() => setEditingId(null)} aria-label="Bekor qilish">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <span
                key={tag.id}
                className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm dark:border-line-dark"
              >
                #{tag.name}
                <button
                  onClick={() => {
                    setEditingId(tag.id);
                    setEditName(tag.name);
                  }}
                  aria-label="Tahrirlash"
                  className="text-muted hover:text-accent"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(tag)}
                  aria-label="O'chirish"
                  className="text-muted hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            )
          )}
          {tags.length === 0 && <p className="text-sm text-muted">Hozircha teglar yo'q.</p>}
        </div>
      )}
    </div>
  );
}
