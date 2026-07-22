"use client";

import { useEffect } from "react";
import { registerArticleView } from "@/lib/data/interactions";

export function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    void registerArticleView(articleId);
  }, [articleId]);

  return null;
}
