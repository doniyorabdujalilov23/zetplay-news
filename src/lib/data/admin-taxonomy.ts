import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { slugify } from "@/lib/utils/slug";

export async function createCategory(name: string, order: number, description?: string): Promise<void> {
  await addDoc(collection(db, "categories"), {
    name: name.trim(),
    slug: slugify(name),
    description: description?.trim() || "",
    order,
    createdAt: serverTimestamp(),
  });
}

export async function updateCategory(
  id: string,
  name: string,
  order: number,
  description?: string
): Promise<void> {
  await updateDoc(doc(db, "categories", id), {
    name: name.trim(),
    slug: slugify(name),
    description: description?.trim() || "",
    order,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

export async function getNextCategoryOrder(): Promise<number> {
  const snap = await getDocs(query(collection(db, "categories"), orderBy("order", "desc")));
  const highest = snap.docs[0]?.data().order ?? 0;
  return highest + 1;
}

export async function createTag(name: string): Promise<void> {
  await addDoc(collection(db, "tags"), {
    name: name.trim(),
    slug: slugify(name),
    createdAt: serverTimestamp(),
  });
}

export async function updateTag(id: string, name: string): Promise<void> {
  await updateDoc(doc(db, "tags", id), {
    name: name.trim(),
    slug: slugify(name),
  });
}

export async function deleteTag(id: string): Promise<void> {
  await deleteDoc(doc(db, "tags", id));
}
