import Link from "next/link";
import { Facebook, Instagram, Send, Youtube, Twitter } from "lucide-react";
import { getCategories } from "@/lib/data/taxonomy";
import { getSiteSettings } from "@/lib/data/settings";

export async function Footer() {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  const socialLinks = [
    { key: "facebook", href: settings.socials.facebook, icon: Facebook, label: "Facebook" },
    { key: "instagram", href: settings.socials.instagram, icon: Instagram, label: "Instagram" },
    { key: "telegram", href: settings.socials.telegram, icon: Send, label: "Telegram" },
    { key: "youtube", href: settings.socials.youtube, icon: Youtube, label: "YouTube" },
    { key: "twitter", href: settings.socials.twitter, icon: Twitter, label: "X (Twitter)" },
  ].filter((item) => !!item.href);

  return (
    <footer className="mt-16 border-t border-line bg-paper-dim dark:border-line-dark dark:bg-surface-dark-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="font-display text-xl font-bold">
            Zet<span className="text-accent">Play</span>{" "}
            <span className="text-sm font-normal text-muted">News</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{settings.siteDescription}</p>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ key, href, icon: Icon, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="eyebrow mb-4">Bo'limlar</h3>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategoriya/${category.slug}`}
                  className="text-muted transition hover:text-accent"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Sayt</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/qidiruv" className="text-muted transition hover:text-accent">
                Qidiruv
              </Link>
            </li>
            <li>
              <Link href="/rss.xml" className="text-muted transition hover:text-accent">
                RSS lenta
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-muted transition hover:text-accent">
                Admin panel
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 dark:border-line-dark">
        <p className="container-page text-center text-xs text-muted">{settings.footerText}</p>
      </div>
    </footer>
  );
}
