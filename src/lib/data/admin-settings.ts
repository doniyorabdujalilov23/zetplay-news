import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { SiteSettings } from "@/types";

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await setDoc(doc(db, "settings", "site"), settings, { merge: true });
}
