// Uzbek Latin alifbosidagi maxsus belgilarni (o', g') lotin harflariga almashtirish uchun xarita.
// Unicode escape kodlaridan foydalanilgan, chunki turli klaviatura/tizimlarda apostrof belgisi
// har xil kodlanishi mumkin (\u02BB, \u2018, \u2019 yoki oddiy ').
const SPECIAL_CHAR_MAP: Record<string, string> = {
  "o\u02BB": "o",
  "o\u2018": "o",
  "o\u2019": "o",
  "o'": "o",
  "g\u02BB": "g",
  "g\u2018": "g",
  "g\u2019": "g",
  "g'": "g",
  "\u02BB": "",
  "\u2018": "",
  "\u2019": "",
  "'": "",
};

export function slugify(input: string): string {
  let text = input.toLowerCase().trim();

  Object.entries(SPECIAL_CHAR_MAP).forEach(([from, to]) => {
    text = text.split(from).join(to);
  });

  text = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // diakritik belgilarni olib tashlash
    .replace(/[^a-z0-9\s-]/g, "") // qolgan lotin bo'lmagan belgilarni olib tashlash
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return text || "maqola";
}

export function slugifyUnique(input: string, existingSlugs: string[]): string {
  const base = slugify(input);
  if (!existingSlugs.includes(base)) return base;

  let counter = 2;
  let candidate = `${base}-${counter}`;
  while (existingSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}
