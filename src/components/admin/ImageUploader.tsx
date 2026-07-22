"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile, type UploadFolder } from "@/lib/data/admin-media";
import { useAuth } from "@/context/AuthContext";

interface ImageUploaderProps {
  value: string;
  onChange: (result: { url: string; path: string }) => void;
  folder?: UploadFolder;
  label?: string;
}

export function ImageUploader({ value, onChange, folder = "news-images", label = "Asosiy rasm" }: ImageUploaderProps) {
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!user) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Faqat rasm fayllarini yuklash mumkin");
        return;
      }
      setProgress(0);
      try {
        const result = await uploadFile(file, folder, user.uid, setProgress);
        onChange(result);
        toast.success("Rasm muvaffaqiyatli yuklandi");
      } catch {
        toast.error("Rasmni yuklashda xatolik yuz berdi");
      } finally {
        setProgress(null);
      }
    },
    [folder, onChange, user]
  );

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-line dark:border-line-dark">
          <Image src={value} alt="Yuklangan rasm" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange({ url: "", path: "" })}
            aria-label="Rasmni o'chirish"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition ${
            dragging ? "border-accent bg-accent/5" : "border-line dark:border-line-dark"
          }`}
          onClick={() => document.getElementById(`file-input-${folder}-${label}`)?.click()}
        >
          {progress !== null ? (
            <>
              <Loader2 className="animate-spin text-accent" size={24} />
              <span className="mt-2 font-mono text-xs text-muted">{Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <UploadCloud size={28} className="text-muted" />
              <span className="mt-2 text-sm text-muted">Rasmni shu yerga tashlang yoki bosing</span>
            </>
          )}
          <input
            id={`file-input-${folder}-${label}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
