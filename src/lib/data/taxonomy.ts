import { collection, query, orderBy, getDocs, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Category, Tag } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, "id">) }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const q = query(collection(db, "categories"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return { id: d.id, ...(d.data() as Omit<Category, "id">) };
}

export async function getTags(): Promise<Tag[]> {
  const q = query(collection(db, "tags"), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tag, "id">) }));
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const q = query(collection(db, "tags"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return { id: d.id, ...(d.data() as Omit<Tag, "id">) };
}
