export const SITE_CONFIG = {
  name: "ZetPlay News",
  shortName: "ZetPlay",
  description:
    "ZetPlay News — O'zbekiston va dunyo bo'ylab eng so'nggi yangiliklar, tahlillar va reportajlar. Tezkor, ishonchli, xolis.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zetplay.news",
  locale: "uz_UZ",
  themeColor: "#1546E0",
};

export const DEFAULT_CATEGORIES: { name: string; slug: string; order: number }[] = [
  { name: "O'zbekiston", slug: "ozbekiston", order: 1 },
  { name: "Dunyo", slug: "dunyo", order: 2 },
  { name: "Sport", slug: "sport", order: 3 },
  { name: "Texnologiya", slug: "texnologiya", order: 4 },
  { name: "Iqtisodiyot", slug: "iqtisodiyot", order: 5 },
  { name: "Siyosat", slug: "siyosat", order: 6 },
  { name: "Madaniyat", slug: "madaniyat", order: 7 },
  { name: "Avto", slug: "avto", order: 8 },
  { name: "Kino", slug: "kino", order: 9 },
  { name: "O'yinlar", slug: "oyinlar", order: 10 },
];

export const ARTICLES_PER_PAGE = 12;
export const RELATED_ARTICLES_COUNT = 4;
export const POPULAR_ARTICLES_COUNT = 6;
export const FEATURED_SLIDER_COUNT = 5;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  editor: "Muharrir",
  moderator: "Moderator",
};

export const COMMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  approved: "Tasdiqlangan",
  spam: "Spam",
};
