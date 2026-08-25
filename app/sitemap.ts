import type { MetadataRoute } from "next";

export const revalidate = 3600;

const VALID_CHANGE_FREQUENCIES = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

type SitemapChangeFrequency = (typeof VALID_CHANGE_FREQUENCIES)[number];

type RawSitemapItem = {
  url?: unknown;
  loc?: unknown;
  lastModified?: unknown;
  lastmod?: unknown;
  updatedAt?: unknown;
  changeFrequency?: unknown;
  changefreq?: unknown;
  priority?: unknown;
};

function trimTrailingSlash(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function getSiteUrl() {
  return trimTrailingSlash(
    process.env.SITE_URL || process.env.WEBSITE_URL || "http://localhost:3000",
  );
}

function getApiBaseUrl() {
  return trimTrailingSlash(
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "",
  );
}

function getPublicSiteKey() {
  return (
    process.env.PUBLIC_SITE_KEY ||
    process.env.NEXT_PUBLIC_SITE_KEY ||
    process.env.NEXT_PUBLIC_PUBLIC_SITE_KEY ||
    ""
  ).trim();
}

function isValidChangeFrequency(
  value: unknown,
): value is SitemapChangeFrequency {
  return VALID_CHANGE_FREQUENCIES.includes(value as SitemapChangeFrequency);
}

function normalizePriority(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : undefined;
}

function normalizeLastModified(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getItems(payload: unknown): RawSitemapItem[] {
  if (Array.isArray(payload)) return payload as RawSitemapItem[];
  if (!payload || typeof payload !== "object") return [];

  const root = payload as {
    data?: unknown;
    items?: unknown;
  };

  if (Array.isArray(root.items)) return root.items as RawSitemapItem[];
  if (Array.isArray(root.data)) return root.data as RawSitemapItem[];
  if (root.data && typeof root.data === "object") {
    const data = root.data as { items?: unknown; entries?: unknown };
    if (Array.isArray(data.entries)) return data.entries as RawSitemapItem[];
    if (Array.isArray(data.items)) return data.items as RawSitemapItem[];
  }

  return [];
}

function normalizeLegacyPath(pathname: string) {
  if (pathname.startsWith("/blog/category/")) {
    return pathname.replace(/^\/blog\/category\//, "/chuyen-muc/");
  }
  if (pathname.startsWith("/blog/")) {
    return pathname.replace(/^\/blog\//, "/bai-viet/");
  }
  if (pathname.startsWith("/products/category/")) {
    return pathname.replace(/^\/products\/category\//, "/danh-muc/");
  }
  if (pathname.startsWith("/products/")) {
    return pathname.replace(/^\/products\//, "/san-pham/");
  }
  if (pathname.startsWith("/dich-vu/")) {
    return pathname.replace(/^\/dich-vu\//, "/san-pham/");
  }
  return pathname;
}

function normalizeUrl(value: string, siteUrl: string) {
  const url = new URL(value, `${siteUrl}/`);
  url.pathname = normalizeLegacyPath(url.pathname);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function fallbackSitemap(siteUrl: string): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/danh-muc`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/chuyen-muc`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/lien-he`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/du-an`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/video`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/chinh-sach`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/bao-gia`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const apiBaseUrl = getApiBaseUrl();
  const publicSiteKey = getPublicSiteKey();

  if (!apiBaseUrl || !publicSiteKey) return fallbackSitemap(siteUrl);

  try {
    const response = await fetch(`${apiBaseUrl}/api/public/sitemap`, {
      next: { revalidate },
      headers: {
        Accept: "application/json",
        "x-public-site-key": publicSiteKey,
        "x-public-host": new URL(siteUrl).host,
      },
    });

    if (!response.ok) return fallbackSitemap(siteUrl);

    const items = getItems(await response.json());
    const deduped = new Map<string, MetadataRoute.Sitemap[number]>();

    for (const item of items) {
      const rawUrl = typeof item.url === "string" ? item.url : item.loc;
      if (typeof rawUrl !== "string" || !rawUrl.trim()) continue;

      const url = normalizeUrl(rawUrl, siteUrl);
      const changeFrequencyValue = item.changeFrequency || item.changefreq;
      deduped.set(url, {
        url,
        lastModified: normalizeLastModified(
          item.lastModified || item.lastmod || item.updatedAt,
        ),
        changeFrequency: isValidChangeFrequency(changeFrequencyValue)
          ? changeFrequencyValue
          : "weekly",
        priority: normalizePriority(item.priority),
      });
    }

    return deduped.size > 0
      ? Array.from(deduped.values())
      : fallbackSitemap(siteUrl);
  } catch {
    return fallbackSitemap(siteUrl);
  }
}
