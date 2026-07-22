import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Article, AppUser } from "@/types";

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  todayArticles: number;
  totalViews: number;
  topArticles: Article[];
  recentUsers: AppUser[];
}

function startOfToday(): Timestamp {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(date);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const newsRef = collection(db, "news");

  const [totalSnap, publishedSnap, draftSnap, todaySnap, topSnap, allForViewsSnap, usersSnap] =
    await Promise.all([
      getCountFromServer(newsRef),
      getCountFromServer(query(newsRef, where("status", "==", "published"))),
      getCountFromServer(query(newsRef, where("status", "==", "draft"))),
      getCountFromServer(query(newsRef, where("createdAt", ">=", startOfToday()))),
      getDocs(query(newsRef, orderBy("views", "desc"), limit(5))),
      getDocs(query(newsRef, where("status", "==", "published"))),
      getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(8))),
    ]);

  const totalViews = allForViewsSnap.docs.reduce((sum, d) => sum + (d.data().views || 0), 0);

  const topArticles = topSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Article, "id">) }));
  const recentUsers = usersSnap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AppUser, "uid">) }));

  return {
    totalArticles: totalSnap.data().count,
    publishedArticles: publishedSnap.data().count,
    draftArticles: draftSnap.data().count,
    todayArticles: todaySnap.data().count,
    totalViews,
    topArticles,
    recentUsers,
  };
}
