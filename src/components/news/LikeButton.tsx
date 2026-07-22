"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { hasLikedArticle, toggleLikeArticle } from "@/lib/data/interactions";
import { cn } from "@/lib/utils/cn";

export function LikeButton({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(hasLikedArticle(articleId));
  }, [articleId]);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setLikes((prev) => (optimisticLiked ? prev + 1 : Math.max(0, prev - 1)));
    try {
      await toggleLikeArticle(articleId);
    } catch {
      setLiked(!optimisticLiked);
      setLikes((prev) => (optimisticLiked ? Math.max(0, prev - 1) : prev + 1));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        liked
          ? "border-accent bg-accent text-white"
          : "border-line text-ink hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
      )}
    >
      <Heart size={15} className={liked ? "fill-current" : ""} />
      {likes}
    </button>
  );
}
