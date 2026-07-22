/**
 * Standart kategoriyalar va sayt sozlamalarini yaratish uchun skript.
 * Ishga tushirish: npm run seed
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DEFAULT_CATEGORIES, SITE_CONFIG } from "../src/lib/constants";

async function main() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_ADMIN_* o'zgaruvchilari .env.local faylida topilmadi.");
  }

  const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  const db = getFirestore(app);

  const existing = await db.collection("categories").limit(1).get();
  if (existing.empty) {
    const batch = db.batch();
    DEFAULT_CATEGORIES.forEach((category) => {
      const ref = db.collection("categories").doc();
      batch.set(ref, { ...category, description: "", createdAt: new Date() });
    });
    await batch.commit();
    console.log(`✅ ${DEFAULT_CATEGORIES.length} ta standart kategoriya yaratildi.`);
  } else {
    console.log("ℹ️  Kategoriyalar allaqachon mavjud, o'tkazib yuborildi.");
  }

  const settingsRef = db.collection("settings").doc("site");
  const settingsSnap = await settingsRef.get();
  if (!settingsSnap.exists) {
    await settingsRef.set({
      siteName: SITE_CONFIG.name,
      siteDescription: SITE_CONFIG.description,
      logoUrl: "",
      faviconUrl: "",
      footerText: `© ${new Date().getFullYear()} ${SITE_CONFIG.name}. Barcha huquqlar himoyalangan.`,
      socials: {},
      googleAnalyticsId: "",
      adSlots: {},
    });
    console.log("✅ Standart sayt sozlamalari yaratildi.");
  } else {
    console.log("ℹ️  Sayt sozlamalari allaqachon mavjud, o'tkazib yuborildi.");
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Xatolik:", error);
  process.exit(1);
});
