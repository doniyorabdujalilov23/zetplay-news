import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const LIKED_KEY = "zetplay_liked_articles";
const VIEWED_KEY = "zetplay_viewed_articles";

function readLocalSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeLocalSet(key: string, set: Set<string>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export function hasLikedArticle(articleId: string): boolean {
  return readLocalSet(LIKED_KEY).has(articleId);
}

export async function toggleLikeArticle(articleId: string): Promise<boolean> {
  const likedSet = readLocalSet(LIKED_KEY);
  const alreadyLiked = likedSet.has(articleId);
  const articleRef = doc(db, "news", articleId);

  if (alreadyLiked) {
    await updateDoc(articleRef, { likes: increment(-1) });
    likedSet.delete(articleId);
  } else {
    await updateDoc(articleRef, { likes: increment(1) });
    likedSet.add(articleId);
  }
  writeLocalSet(LIKED_KEY, likedSet);
  return !alreadyLiked;
}

export async function registerArticleView(articleId: string): Promise<void> {
  const viewedSet = readLocalSet(VIEWED_KEY);
  if (viewedSet.has(articleId)) return;

  try {
    await fetch("/api/articles/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    });
    viewedSet.add(articleId);
    writeLocalSet(VIEWED_KEY, viewedSet);
  } catch {
    // silently ignore — view counting is not critical path
  }
}
