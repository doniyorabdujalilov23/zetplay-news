"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { extractYoutubeId } from "@/lib/utils/format";

export function YoutubeEmbed({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYoutubeId(url);

  if (!videoId) return null;

  return (
    <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-ink">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Videoni ijro etish"
          className="group absolute inset-0 h-full w-full"
        >
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video ko'rinishi"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30 transition group-hover:bg-ink/40">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-lg transition group-hover:scale-110">
              <Play size={24} className="ml-1 fill-current" />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
