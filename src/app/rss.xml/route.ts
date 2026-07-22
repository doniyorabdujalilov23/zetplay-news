import { getPublishedArticles } from "@/lib/data/articles";
import { SITE_CONFIG } from "@/lib/constants";
import { toDate, stripHtml } from "@/lib/utils/format";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { items } = await getPublishedArticles({ pageSize: 50 });

  const feedItems = items
    .map((article) => {
      const pubDate = toDate(article.publishedAt);
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_CONFIG.url}/yangilik/${article.slug}</link>
      <guid isPermaLink="true">${SITE_CONFIG.url}/yangilik/${article.slug}</guid>
      <description>${escapeXml(stripHtml(article.excerpt))}</description>
      <category>${escapeXml(article.categoryName)}</category>
      <author>${escapeXml(article.authorName)}</author>
      ${pubDate ? `<pubDate>${pubDate.toUTCString()}</pubDate>` : ""}
      <enclosure url="${article.coverImage}" type="image/jpeg" />
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${SITE_CONFIG.url}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>uz</language>
    <atom:link href="${SITE_CONFIG.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
