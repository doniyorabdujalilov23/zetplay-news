import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import type { Article, ArticleFormInput, Category, Tag } from "@/types";
import { slugifyUnique } from "@/lib/utils/slug";
import { calculateReadingTime } from "@/lib/utils/format";

const ARTICLES_COLLECTION = "news";

function mapArticle(id: string, data: Record<string, unknown>): Article {
  return { id, ...(data as Omit<Article, "id">) };
}

export async function getAdminArticles(count = 100): Promise<Article[]> {
  const q = query(collection(db, ARTICLES_COLLECTION), orderBy("createdAt", "desc"), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapArticle(d.id, d.data()));
}

export async function getAdminArticleById(id: string): Promise<Article | null> {
  const snap = await getDoc(doc(db, ARTICLES_COLLECTION, id));
  if (!snap.exists()) return null;
  return mapArticle(snap.id, snap.data());
}

async function getExistingSlugs(): Promise<string[]> {
  const snap = await getDocs(collection(db, ARTICLES_COLLECTION));
  return snap.docs.map((d) => d.data().slug as string);
}

function resolveArticleStatus(input: ArticleFormInput): {
  status: Article["status"];
  publishedAt: Timestamp | null;
  scheduledAt: Timestamp | null;
} {
  if (input.status === "scheduled" && input.scheduledAt) {
    const scheduledDate = new Date(input.scheduledAt);
    const isFuture = scheduledDate.getTime() > Date.now();
    return {
      status: isFuture ? "scheduled" : "published",
      publishedAt: isFuture ? null : Timestamp.fromDate(scheduledDate),
      scheduledAt: isFuture ? Timestamp.fromDate(scheduledDate) : null,
    };
  }
  if (input.status === "published") {
    return { status: "published", publishedAt: Timestamp.now(), scheduledAt: null };
  }
  return { status: "draft", publishedAt: null, scheduledAt: null };
}

export async function createArticle(
  input: ArticleFormInput,
  category: Category,
  tags: Tag[],
  author: { uid: string; name: string; photoURL?: string | null }
): Promise<string> {
  const existingSlugs = await getExistingSlugs();
  const slug = slugifyUnique(input.slug || input.title, existingSlugs);
  const { status, publishedAt, scheduledAt } = resolveArticleStatus(input);

  const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    coverImagePath: input.coverImagePath || "",
    gallery: input.gallery,
    youtubeUrl: input.youtubeUrl || "",
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    tagIds: tags.map((t) => t.id),
    tagNames: tags.map((t) => t.name),
    tagSlugs: tags.map((t) => t.slug),
    authorId: author.uid,
    authorName: author.name,
    authorPhotoURL: author.photoURL || null,
    status,
    featured: input.featured,
    publishedAt,
    scheduledAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    likes: 0,
    commentsCount: 0,
    readingTimeMinutes: calculateReadingTime(input.content),
    seoTitle: input.seoTitle || "",
    seoDescription: input.seoDescription || "",
    seoKeywords: input.seoKeywords || [],
  });

  return docRef.id;
}

export async function updateArticle(
  id: string,
  input: ArticleFormInput,
  category: Category,
  tags: Tag[]
): Promise<void> {
  const existingSlugs = await getExistingSlugs();
  const current = await getAdminArticleById(id);
  const otherSlugs = existingSlugs.filter((s) => s !== current?.slug);
  const slug =
    input.slug && input.slug === current?.slug
      ? input.slug
      : slugifyUnique(input.slug || input.title, otherSlugs);

  const { status, publishedAt, scheduledAt } = resolveArticleStatus(input);

  await updateDoc(doc(db, ARTICLES_COLLECTION, id), {
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    coverImagePath: input.coverImagePath || "",
    gallery: input.gallery,
    youtubeUrl: input.youtubeUrl || "",
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    tagIds: tags.map((t) => t.id),
    tagNames: tags.map((t) => t.name),
    tagSlugs: tags.map((t) => t.slug),
    status,
    featured: input.featured,
    publishedAt: publishedAt ?? current?.publishedAt ?? null,
    scheduledAt,
    updatedAt: serverTimestamp(),
    readingTimeMinutes: calculateReadingTime(input.content),
    seoTitle: input.seoTitle || "",
    seoDescription: input.seoDescription || "",
    seoKeywords: input.seoKeywords || [],
  });
}

export async function deleteArticle(article: Article): Promise<void> {
  await deleteDoc(doc(db, ARTICLES_COLLECTION, article.id));
  if (article.coverImagePath) {
    try {
      await deleteObject(ref(storage, article.coverImagePath));
    } catch {
      // image may already be removed; ignore
    }
  }
  for (const image of article.gallery) {
    try {
      await deleteObject(ref(storage, image.path));
    } catch {
      // ignore
    }
  }
}
