"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/data/admin-media";
import { useAuth } from "@/context/AuthContext";
import type { GalleryImage } from "@/types";

interface GalleryUploaderProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export function GalleryUploader({ images, onChange }: GalleryUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (!user) return;
      setUploading(true);
      try {
        const uploads = await Promise.all(
          Array.from(files)
            .filter((f) => f.type.startsWith("image/"))
            .map((file) => uploadFile(file, "news-images", user.uid))
        );
        onChange([...images, ...uploads.map((u) => ({ url: u.url, path: u.path, caption: "" }))]);
        toast.success(`${uploads.length} ta rasm qo'shildi`);
      } catch {
        toast.error("Galereyaga rasm qo'shishda xatolik");
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, user]
  );

  const removeImage = (path: string) => {
    onChange(images.filter((img) => img.path !== path));
  };

  const updateCaption = (path: string, caption: string) => {
    onChange(images.map((img) => (img.path === path ? { ...img, caption } : img)));
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">Galereya</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <div key={image.path} className="space-y-1">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-line dark:border-line-dark">
              <Image src={image.url} alt={image.caption || "Galereya rasmi"} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image.path)}
                aria-label="Rasmni o'chirish"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white"
              >
                <X size={12} />
              </button>
            </div>
            <input
              type="text"
              value={image.caption || ""}
              onChange={(e) => updateCaption(image.path, e.target.value)}
              placeholder="Izoh (ixtiyoriy)"
              className="w-full rounded border border-line bg-transparent px-2 py-1 text-xs outline-none focus:border-accent dark:border-line-dark"
            />
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line text-muted transition hover:border-accent hover:text-accent dark:border-line-dark">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
          <span className="mt-1 text-[11px]">Qo'shish</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
