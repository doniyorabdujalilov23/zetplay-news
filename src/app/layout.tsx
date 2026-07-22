import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { SITE_CONFIG } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data/settings";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0D12" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — Tezkor va ishonchli yangiliklar`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  manifest: "/manifest.webmanifest",
  keywords: [
    "yangiliklar",
    "O'zbekiston yangiliklari",
    "dunyo yangiliklari",
    "ZetPlay News",
    "sport yangiliklari",
    "texnologiya yangiliklari",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — Tezkor va ishonchli yangiliklar`,
    description: SITE_CONFIG.description,
    images: [{ url: "/icons/og-default.png", width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — Tezkor va ishonchli yangiliklar`,
    description: SITE_CONFIG.description,
    images: ["/icons/og-default.png"],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    types: { "application/rss+xml": `${SITE_CONFIG.url}/rss.xml` },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: settings.siteName,
    url: SITE_CONFIG.url,
    logo: settings.logoUrl || `${SITE_CONFIG.url}/icons/logo.png`,
    description: settings.siteDescription,
    sameAs: Object.values(settings.socials).filter(Boolean),
  };

  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {settings.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        {settings.adSlots.headerCode && (
          <div
            className="container-page py-2"
            dangerouslySetInnerHTML={{ __html: settings.adSlots.headerCode }}
          />
        )}
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
