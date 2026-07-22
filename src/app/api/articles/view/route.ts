import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const { articleId } = (await request.json()) as { articleId?: string };
    if (!articleId) {
      return NextResponse.json({ error: "articleId talab qilinadi" }, { status: 400 });
    }

    await adminDb
      .collection("news")
      .doc(articleId)
      .update({ views: FieldValue.increment(1) });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ko'rishlar sonini yangilab bo'lmadi" }, { status: 500 });
  }
}
