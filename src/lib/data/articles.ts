import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Article, PaginatedResult } from "@/types";
import { ARTICLES_PER_PAGE, RELATED_ARTICLES_COUNT } from "@/lib/constants";

const ARTICLES_COLLECTION = "news";

function mapArticle(snap: QueryDocumentSnapshot<DocumentData>): Article {
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    coverImagePath: data.coverImagePath,
    gallery: data.gallery || [],
    youtubeUrl: data.youtubeUrl || "",
    categoryId: data.categoryId,
    categorySlug: data.categorySlug,
    categoryName: data.categoryName,
    tagIds: data.tagIds || [],
    tagNames: data.tagNames || [],
    tagSlugs: data.tagSlugs || [],
    authorId: data.authorId,
    authorName: data.authorName,
    authorPhotoURL: data.authorPhotoURL || null,
    status: data.status,
    featured: !!data.featured,
    publishedAt: data.publishedAt || null,
    scheduledAt: data.scheduledAt || null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    views: data.views || 0,
    likes: data.likes || 0,
    commentsCount: data.commentsCount || 0,
    readingTimeMinutes: data.readingTimeMinutes || 1,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    seoKeywords: data.seoKeywords || [],
  };
}

export async function getPublishedArticles(options?: {
  categorySlug?: string;
  tagSlug?: string;
  pageSize?: number;
  cursor?: string;
}): Promise<PaginatedResult<Article>> {
  const pageSize = options?.pageSize ?? ARTICLES_PER_PAGE;
  const constraints = [where("status", "==", "published")];

  if (options?.categorySlug) {
    constraints.push(where("categorySlug", "==", options.categorySlug));
  }
  if (options?.tagSlug) {
    constraints.push(where("tagSlugs", "array-contains", options.tagSlug));
  }

  let q = query(
    collection(db, ARTICLES_COLLECTION),
    ...constraints,
    orderBy("publishedAt", "desc"),
    limit(pageSize + 1)
  );

  if (options?.cursor) {
    const cursorDoc = await getDoc(doc(db, ARTICLES_COLLECTION, options.cursor));
    if (cursorDoc.exists()) {
      q = query(
        collection(db, ARTICLES_COLLECTION),
        ...constraints,
        orderBy("publishedAt", "desc"),
        startAfter(cursorDoc),
        limit(pageSize + 1)
      );
    }
  }

  const snap = await getDocs(q);
  const docs = snap.docs.slice(0, pageSize);
  const items = docs.map(mapArticle);
  const hasMore = snap.docs.length > pageSize;
  const lastCursor = docs.length ? docs[docs.length - 1]!.id : null;

  return { items, lastCursor, hasMore };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return mapArticle(snap.docs[0]!);
}

export async function getArticleBySlugAnyStatus(slug: string): Promise<Article | null> {
  const q = query(collection(db, ARTICLES_COLLECTION), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return mapArticle(snap.docs[0]!);
}

export async function getFeaturedArticles(count: number): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("featured", "==", true),
    orderBy("publishedAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(mapArticle);
}

export async function getPopularArticles(count: number): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("views", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(mapArticle);
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("categorySlug", "==", article.categorySlug),
    orderBy("publishedAt", "desc"),
    limit(RELATED_ARTICLES_COUNT + 1)
  );
  const snap = await getDocs(q);
  return snap.docs.map(mapArticle).filter((item) => item.id !== article.id).slice(0, RELATED_ARTICLES_COUNT);
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; updatedAt: Timestamp | Date }[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(5000)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ slug: d.data().slug, updatedAt: d.data().updatedAt }));
}

export async function searchArticles(searchTerm: string, count = 20): Promise<Article[]> {
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return [];

  // Firestore has no native full-text search; we fetch recent published articles
  // and filter client-side across title, excerpt, content and tags.
  // For production-grade full-text search, connect Algolia or Typesense here.
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(300)
  );
  const snap = await getDocs(q);
  const all = snap.docs.map(mapArticle);

  return all
    .filter((a) => {
      const haystack = [a.title, a.excerpt, a.content, ...(a.tagNames || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .slice(0, count);
}
