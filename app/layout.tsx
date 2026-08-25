import "@/styles/globals.css";
import "@/styles/CKGlobal.css";
import "@/styles/Animation.css";
import "@/styles/article-toc.css";
import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { VisitTracker } from "@/features/analytics/components/VisitTracker";
import { getPublicSiteSettings } from "@/features/site/services/site.service";
import Hotline from "@/components/layout/Hotline";
import Copyright from "@/components/layout/Copyright";
import BookingPage from "@/components/layout/Booking";
import { getCatalogCategories } from "@/features/catalog/services/catalog.service";
import { SITE_FALLBACK } from "@/features/site/constants";

function toMetadataUrl(value: string | null | undefined): URL {
  try {
    return new URL(value ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteName =
    settings.siteName && settings.siteName !== "Website"
      ? settings.siteName
      : SITE_FALLBACK.name;
  const title = settings.seo?.title ?? siteName;
  const description =
    settings.seo?.description ??
    settings.description ??
    settings.slogan ??
    SITE_FALLBACK.description;
  const metadataBase = toMetadataUrl(
    settings.frontendUrl ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000",
  );
  const ogImage =
    settings.seo?.ogImage ??
    settings.ogImageUrl ??
    settings.logoUrl ??
    undefined;

  return {
    metadataBase,
    title,
    description,
    keywords: settings.seo?.keywords ?? undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    alternates: {
      canonical: "/",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, catalogCategories] = await Promise.all([
    getPublicSiteSettings(),
    getCatalogCategories(),
  ]);
  const siteName =
    settings.siteName && settings.siteName !== "Website"
      ? settings.siteName
      : SITE_FALLBACK.name;

  return (
    <html lang="vi">
      <body>
        {settings.seo?.tracking?.gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(settings.seo.tracking.gtmId)});`}
          </Script>
        ) : null}
        {settings.seo?.tracking?.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.seo.tracking.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <VisitTracker />

        <div className="flex min-h-screen flex-col bg-white text-zinc-950">
          <SiteHeader
            settings={settings}
            catalogCategories={catalogCategories}
          />
          <main>{children}</main>

          <Hotline settings={settings} />
          <BookingPage settings={settings} />
          <SiteFooter
            settings={settings}
            catalogCategories={catalogCategories}
          />
          {/* <Copyright siteName={siteName} /> */}
        </div>
      </body>
    </html>
  );
}
