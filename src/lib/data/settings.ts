import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { SiteSettings } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: SITE_CONFIG.name,
  siteDescription: SITE_CONFIG.description,
  logoUrl: "",
  faviconUrl: "",
  footerText: `© ${new Date().getFullYear()} ${SITE_CONFIG.name}. Barcha huquqlar himoyalangan.`,
  socials: {},
  adSlots: {},
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
