import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const now = Timestamp.now();
  const snapshot = await adminDb
    .collection("news")
    .where("status", "==", "scheduled")
    .where("scheduledAt", "<=", now)
    .get();

  if (snapshot.empty) {
    return NextResponse.json({ published: 0 });
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      status: "published",
      publishedAt: docSnap.data().scheduledAt,
      scheduledAt: null,
    });
  });
  await batch.commit();

  return NextResponse.json({ published: snapshot.size });
}
