import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { verifyCallerRole } from "@/lib/auth/verifyAdmin";
import type { UserRole } from "@/types";

interface RouteParams {
  params: Promise<{ uid: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const caller = await verifyCallerRole(request, ["admin"]);
  if (!caller) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });

  const { uid } = await params;
  const { role } = (await request.json()) as { role: UserRole };

  if (!["admin", "editor", "moderator"].includes(role)) {
    return NextResponse.json({ error: "Noto'g'ri rol" }, { status: 400 });
  }

  try {
    await adminAuth.setCustomUserClaims(uid, { role });
    await adminDb.collection("users").doc(uid).update({ role });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yangilashda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const caller = await verifyCallerRole(request, ["admin"]);
  if (!caller) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });

  const { uid } = await params;

  if (uid === caller.uid) {
    return NextResponse.json({ error: "O'zingizni o'chira olmaysiz" }, { status: 400 });
  }

  try {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("users").doc(uid).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "O'chirishda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
