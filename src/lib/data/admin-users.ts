import { auth } from "@/lib/firebase/client";
import type { AppUser, UserRole } from "@/types";

async function authorizedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Autentifikatsiyadan o'tilmagan");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getUsersList(): Promise<AppUser[]> {
  const res = await authorizedFetch("/api/users");
  if (!res.ok) throw new Error("Foydalanuvchilarni yuklab bo'lmadi");
  const data = await res.json();
  return data.users;
}

export async function createUserAccount(input: {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}): Promise<void> {
  const res = await authorizedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Foydalanuvchi yaratishda xatolik");
  }
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  const res = await authorizedFetch(`/api/users/${uid}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Rolni yangilashda xatolik");
}

export async function deleteUserAccount(uid: string): Promise<void> {
  const res = await authorizedFetch(`/api/users/${uid}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "O'chirishda xatolik");
  }
}
