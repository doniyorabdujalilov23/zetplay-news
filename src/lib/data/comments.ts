import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  increment,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Comment } from "@/types";

export async function getApprovedComments(articleId: string): Promise<Comment[]> {
  const q = query(
    collection(db, "comments"),
    where("articleId", "==", articleId),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }));
}

export async function submitComment(input: {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  name: string;
  email: string;
  content: string;
  parentId?: string | null;
}): Promise<void> {
  await addDoc(collection(db, "comments"), {
    articleId: input.articleId,
    articleSlug: input.articleSlug,
    articleTitle: input.articleTitle,
    name: input.name.trim(),
    email: input.email.trim(),
    content: input.content.trim(),
    status: "pending",
    parentId: input.parentId || null,
    likes: 0,
    createdAt: serverTimestamp(),
  });
}

export async function likeComment(commentId: string): Promise<void> {
  await updateDoc(doc(db, "comments", commentId), { likes: increment(1) });
}
