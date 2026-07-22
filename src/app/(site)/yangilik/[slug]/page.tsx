import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import {
  getArticleBySlug,
  getRelatedArticles,
  getAllPublishedSlugs,
} from "@/lib/data/articles";
import { getApprovedComments } from "@/lib/data/comments";
import { getSiteSettings } from "@/lib/data/settings";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/news/ShareButtons";
import { LikeButton } from "@/components/news/LikeButton";
import { ArticleGallery } from "@/components/news/ArticleGallery";
import { YoutubeEmbed } from "@/components/news/YoutubeEmbed";
import { TagList } from "@/components/news/TagList";
import { RelatedArticles } from "@/components/news/RelatedArticles";
import { CommentsSection } from "@/components/news/CommentsSection";
import { ViewTracker } from "@/components/news/ViewTracker";
import { AdSlot } from "@/components/ads/AdSlot";
import { SITE_CONFIG } from "@/lib/constants";
import { formatDate, formatDateTime, formatCompactNumber, stripHtml, truncate } from "@/lib/utils/format";

export const revalidate = 30;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.slice(0, 200).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || truncate(stripHtml(article.excerpt), 160);
  const url = `${SITE_CONFIG.url}/yangilik/${article.slug}`;

  return {
    title,
    description,
    keywords: article.seoKeywords?.length ? article.seoKeywords : article.tagNames,
    alternates: { canonical: url },
    authors: [{ name: article.authorName }],
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: article.publishedAt ? new Date(article.publishedAt as Date).toISOString() : undefined,
      authors: [article.authorName],
      section: article.categoryName,
      tags: article.tagNames,
      images: [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, comments, settings] = await Promise.all([
    getRelatedArticles(article),
    getApprovedComments(article.id),
    getSiteSettings(),
  ]);

  const articleUrl = `${SITE_CONFIG.url}/yangilik/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: stripHtml(article.excerpt),
    image: [article.coverImage, ...article.gallery.map((g) => g.url)],
    datePublished: article.publishedAt ? new Date(article.publishedAt as Date).toISOString() : undefined,
    dateModified: new Date(article.updatedAt as Date).toISOString(),
    author: [{ "@type": "Person", name: article.authorName }],
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      logo: { "@type": "ImageObject", url: settings.logoUrl || `${SITE_CONFIG.url}/icons/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    articleSection: article.categoryName,
    keywords: article.tagNames.join(", "),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: article.views,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: article.likes,
      },
    ],
  };

  return (
    <div className="container-page py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ViewTracker articleId={article.id} />

      <Breadcrumb
        items={[
          { label: article.categoryName, href: `/kategoriya/${article.categorySlug}` },
          { label: article.title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">
          <Link
            href={`/kategoriya/${article.categorySlug}`}
            className="eyebrow inline-block hover:text-accent-hover"
          >
            {article.categoryName}
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{article.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4 dark:border-line-dark">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-line dark:bg-line-dark">
                {article.authorPhotoURL ? (
                  <Image src={article.authorPhotoURL} alt={article.authorName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display font-semibold text-accent">
                    {article.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{article.authorName}</p>
                <p className="font-mono text-xs text-muted" title={formatDateTime(article.publishedAt)}>
                  {formatDate(article.publishedAt)} &middot; {article.readingTimeMinutes} daq. o'qish
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                <Eye size={14} /> {formatCompactNumber(article.views)}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                <Clock size={14} /> {article.readingTimeMinutes} daqiqa
              </span>
            </div>
          </div>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-line dark:bg-line-dark">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>

          <div
            className="prose-article mt-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.youtubeUrl && <YoutubeEmbed url={article.youtubeUrl} />}

          <ArticleGallery images={article.gallery} />

          <TagList tagNames={article.tagNames} />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 dark:border-line-dark">
            <LikeButton articleId={article.id} initialLikes={article.likes} />
            <ShareButtons url={articleUrl} title={article.title} />
          </div>

          <AdSlot code={settings.adSlots.inArticleCode} label="Reklama" className="mt-8" />

          <RelatedArticles articles={related} />

          <CommentsSection
            articleId={article.id}
            articleSlug={article.slug}
            articleTitle={article.title}
            initialComments={comments}
          />
        </article>

        <aside className="space-y-6">
          <AdSlot code={settings.adSlots.sidebarCode} label="Reklama" />
        </aside>
      </div>
    </div>
  );
}
