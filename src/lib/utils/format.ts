import { format, formatDistanceToNow, isValid } from "date-fns";
import { uz } from "date-fns/locale";
import type { Timestamp } from "firebase/firestore";

export function toDate(value: Timestamp | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  return null;
}

export function formatDate(value: Timestamp | Date | null | undefined): string {
  const date = toDate(value);
  if (!date || !isValid(date)) return "";
  return format(date, "d-MMMM, yyyy", { locale: uz });
}

export function formatDateTime(value: Timestamp | Date | null | undefined): string {
  const date = toDate(value);
  if (!date || !isValid(date)) return "";
  return format(date, "d-MMMM, yyyy HH:mm", { locale: uz });
}

export function formatRelativeTime(value: Timestamp | Date | null | undefined): string {
  const date = toDate(value);
  if (!date || !isValid(date)) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: uz });
}

export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
