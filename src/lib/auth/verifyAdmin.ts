import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import type { UserRole } from "@/types";

interface VerifiedCaller {
  uid: string;
  email: string | undefined;
  role: UserRole;
}

export async function verifyCallerRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<VerifiedCaller | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token, true);
    const role = decoded.role as UserRole | undefined;
    if (!role || !allowedRoles.includes(role)) return null;
    return { uid: decoded.uid, email: decoded.email, role };
  } catch {
    return null;
  }
}
