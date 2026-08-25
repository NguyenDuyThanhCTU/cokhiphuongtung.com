import { publicApiFetch } from "@/lib/api/public-api";
import { cacheTags } from "@/lib/cache/cache-tags";
import type { NavigationItem, PublicSiteSettings } from "@/features/site/types";
import {
  navigationSchema,
  publicSiteSettingsSchema,
} from "@/features/site/schemas/site.schema";
import {
  asArray,
  normalizeString,
  unwrapApiData,
} from "@/lib/utils/api-normalizers";
import { SITE_FALLBACK } from "@/features/site/constants";

const fallbackSiteSettings: PublicSiteSettings = {
  siteName: SITE_FALLBACK.name,
  slogan: SITE_FALLBACK.slogan,
  description: SITE_FALLBACK.description,
  hotline: SITE_FALLBACK.primaryHotline,
  contact: {
    hotline: SITE_FALLBACK.primaryHotline,
    phoneSecondary: SITE_FALLBACK.secondaryHotline,
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined;
}

function normalizeSiteSettings(payload: unknown): Record<string, unknown> {
  const rawData = asRecord(unwrapApiData(payload));
  const contact = getRecord(rawData.contact);
  const seo = getRecord(rawData.seo);

  const tracking = getRecord(seo?.tracking);
  const verification = getRecord(seo?.verification);
  const scripts = getRecord(seo?.scripts);

  const siteName = normalizeString(rawData.siteName) ?? "Website";
  const description = normalizeString(rawData.description);
  const slogan = normalizeString(rawData.slogan);
  const logoUrl = normalizeString(rawData.logoUrl);
  const ogImageUrl = normalizeString(rawData.ogImageUrl);
  const resolvedHotline =
    normalizeString(contact?.hotline) ?? normalizeString(rawData.hotline) ?? "";

  return {
    ...rawData,

    hotline: resolvedHotline,
    email: rawData.email ?? contact?.email ?? "",
    contact: {
      ...contact,
      hotline: resolvedHotline,
    },

    seo: {
      ...seo,

      title: normalizeString(seo?.title) ?? siteName,
      description:
        normalizeString(seo?.description) ?? description ?? slogan ?? "",
      keywords: seo?.keywords ?? [],
      ogImage: normalizeString(seo?.ogImage) ?? ogImageUrl ?? logoUrl ?? null,

      tracking: {
        ga4Id: normalizeString(tracking?.ga4Id),
        gtmId: normalizeString(tracking?.gtmId),
        fbPixel: normalizeString(tracking?.fbPixel),
        tiktokPixel: normalizeString(tracking?.tiktokPixel),
      },

      verification: {
        googleSiteVerification: normalizeString(
          verification?.googleSiteVerification,
        ),
      },

      scripts: {
        header: normalizeString(scripts?.header),
        body: normalizeString(scripts?.body),
      },
    },
  };
}

function normalizeNavigationItem(
  value: unknown,
  index: number,
): NavigationItem {
  const item = asRecord(value);
  const children = asArray(item.children).map((child, childIndex) =>
    normalizeNavigationItem(child, childIndex),
  );

  const target = item.target === "_blank" ? "_blank" : "_self";
  return {
    id: normalizeString(item.id) ?? `menu-${index}`,
    label:
      normalizeString(item.label) ??
      normalizeString(item.title) ??
      normalizeString(item.name) ??
      "Menu",
    href:
      normalizeString(item.href) ??
      normalizeString(item.url) ??
      normalizeString(item.path) ??
      "#",
    target,
    children,
  };
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/site", {
      next: { tags: [cacheTags.site, cacheTags.settings] },
    });

    const normalized = normalizeSiteSettings(payload);

    return publicSiteSettingsSchema.parse(normalized);
  } catch (error) {
    console.error(
      "Failed to load public site settings; using local fallback.",
      process.env.NODE_ENV === "development" ? error : undefined,
    );
    return fallbackSiteSettings;
  }
}

export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/navigation", {
      next: { tags: [cacheTags.site, cacheTags.navigation] },
    });

    const normalizedItems = asArray(payload).map((item, index) =>
      normalizeNavigationItem(item, index),
    );

    return navigationSchema.parse(normalizedItems);
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load navigation");
    }

    return [];
  }
}
