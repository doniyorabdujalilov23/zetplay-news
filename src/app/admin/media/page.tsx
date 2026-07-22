"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, Loader2, Search, Copy, Film } from "lucide-react";
import toast from "react-hot-toast";
import { listMediaFromStorage, deleteMediaItem, uploadFile } from "@/lib/data/admin-media";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils/format";
import type { MediaItem } from "@/types";

export default function AdminMediaPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const load = () => {
    setLoading(true);
    listMediaFromStorage()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (files: FileList) => {
    if (!user) return;
    setUploading(true);
    try {
      await Promise.all(
        Array.from(files).map((file) =>
          uploadFile(file, file.type.startsWith("video") ? "uploads" : "news-images", user.uid)
        )
      );
      toast.success("Fayllar yuklandi");
      load();
    } catch {
      toast.error("Yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`"${item.fileName}" faylini o'chirasizmi?`)) return;
    try {
      await deleteMediaItem(item.path);
      setItems((prev) => prev.filter((i) => i.path !== item.path));
      toast.success("Fayl o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("Havola nusxalandi");
  };

  const filtered = items.filter((item) => item.fileName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Media manager</h1>
          <p className="mt-1 text-sm text-muted">Barcha yuklangan rasm va videolar</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          Fayl yuklash
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Fayl nomi bo'yicha qidirish..."
          className="w-full rounded-lg border border-line bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-accent dark:border-line-dark"
        />
      </div>

      {loading ? (
        <div className="mt-8 flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={24} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.path} className="group relative overflow-hidden rounded-lg border border-line dark:border-line-dark">
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                className="relative block aspect-square w-full bg-line dark:bg-line-dark"
              >
                {item.type === "image" ? (
                  <Image src={item.url} alt={item.fileName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <Film size={28} />
                  </div>
                )}
              </button>
              <div className="p-2">
                <p className="truncate text-xs font-medium">{item.fileName}</p>
                <p className="font-mono text-[10px] text-muted">{formatDate(item.createdAt)}</p>
              </div>
              <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => handleCopy(item.url)}
                  aria-label="Havolani nusxalash"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  aria-label="O'chirish"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted">Fayllar topilmadi.</p>
          )}
        </div>
      )}

      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div className="relative h-[80vh] w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            {previewItem.type === "image" ? (
              <Image src={previewItem.url} alt={previewItem.fileName} fill className="object-contain" />
            ) : (
              <video src={previewItem.url} controls className="h-full w-full object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
