/**
 * Birinchi admin foydalanuvchini yaratish uchun skript.
 * Ishga tushirish: npm run create-admin
 * .env.local faylida ADMIN_BOOTSTRAP_EMAIL va ADMIN_BOOTSTRAP_PASSWORD borligiga ishonch hosil qiling.
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

async function main() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_ADMIN_* o'zgaruvchilari .env.local faylida topilmadi.");
  }
  if (!email || !password) {
    throw new Error("ADMIN_BOOTSTRAP_EMAIL va ADMIN_BOOTSTRAP_PASSWORD .env.local faylida topilmadi.");
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`Foydalanuvchi allaqachon mavjud: ${email}`);
  } catch {
    userRecord = await auth.createUser({
      email,
      password,
      displayName: "Bosh Administrator",
      emailVerified: true,
    });
    console.log(`Yangi foydalanuvchi yaratildi: ${email}`);
  }

  await auth.setCustomUserClaims(userRecord.uid, { role: "admin" });

  await db.collection("users").doc(userRecord.uid).set(
    {
      uid: userRecord.uid,
      email,
      displayName: "Bosh Administrator",
      role: "admin",
      createdAt: new Date(),
      lastLoginAt: null,
    },
    { merge: true }
  );

  console.log("✅ Admin roli muvaffaqiyatli tayinlandi.");
  console.log(`Email: ${email}`);
  console.log("Endi /login sahifasi orqali tizimga kirishingiz mumkin.");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Xatolik:", error);
  process.exit(1);
});
