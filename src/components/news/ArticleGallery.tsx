"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryImage } from "@/types";

export function ArticleGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!images.length) return null;

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
  const showNext = () =>
    setActiveIndex((prev) => (prev === null ? null : (prev + 1) % images.length));

  return (
    <div className="mt-8">
      <h3 className="eyebrow mb-3">Galereya</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((image, idx) => (
          <button
            key={image.path}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-line dark:bg-line-dark"
          >
            <Image
              src={image.url}
              alt={image.caption || `Galereya rasmi ${idx + 1}`}
              fill
              sizes="200px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            onClick={close}
          >
            <button
              type="button"
              aria-label="Yopish"
              onClick={close}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              aria-label="Oldingi rasm"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              className="relative h-[70vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex]!.url}
                alt={images[activeIndex]!.caption || "Galereya rasmi"}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              aria-label="Keyingi rasm"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ChevronRight size={20} />
            </button>
            {images[activeIndex]!.caption && (
              <p className="absolute bottom-6 left-1/2 max-w-xl -translate-x-1/2 text-center text-sm text-white/80">
                {images[activeIndex]!.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
