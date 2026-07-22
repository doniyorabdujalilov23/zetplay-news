import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { verifyCallerRole } from "@/lib/auth/verifyAdmin";
import type { UserRole } from "@/types";

export async function GET(request: NextRequest) {
  const caller = await verifyCallerRole(request, ["admin"]);
  if (!caller) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });

  const snapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get();
  const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const caller = await verifyCallerRole(request, ["admin"]);
  if (!caller) return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });

  const body = await request.json();
  const { email, password, displayName, role } = body as {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
  };

  if (!email || !password || !displayName || !role) {
    return NextResponse.json({ error: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 });
  }

  try {
    const userRecord = await adminAuth.createUser({ email, password, displayName });
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    await adminDb
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email,
        displayName,
        role,
        createdAt: new Date(),
        lastLoginAt: null,
      });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Foydalanuvchi yaratishda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
