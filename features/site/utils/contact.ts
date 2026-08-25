import type { PublicSiteSettings } from "@/features/site/types";
import { SITE_FALLBACK } from "@/features/site/constants";

function normalizeContactValue(value?: string | null) {
  return value?.trim() ?? "";
}

export function getPrimaryHotline(settings: PublicSiteSettings): string {
  return (
    normalizeContactValue(settings.contact?.hotline) ||
    normalizeContactValue(settings.hotline) ||
    SITE_FALLBACK.primaryHotline
  );
}

export function getSecondaryHotline(settings: PublicSiteSettings): string {
  const primaryHotline = getPrimaryHotline(settings);
  const secondaryHotline =
    normalizeContactValue(settings.contact?.phoneSecondary) ||
    SITE_FALLBACK.secondaryHotline;

  return secondaryHotline === primaryHotline ? "" : secondaryHotline;
}

export function getHotlines(settings: PublicSiteSettings): string[] {
  return Array.from(
    new Set(
      [getPrimaryHotline(settings), getSecondaryHotline(settings)].filter(
        Boolean,
      ),
    ),
  );
}

export function getPhoneHref(phone?: string | null): string {
  const normalizedPhone = normalizeContactValue(phone).replace(/[^\d+]/g, "");
  return normalizedPhone ? `tel:${normalizedPhone}` : "/lien-he";
}

export function getZaloHref(settings: PublicSiteSettings): string {
  const configuredZalo =
    normalizeContactValue(settings.social?.zaloChat) ||
    normalizeContactValue(settings.contact?.zalo) ||
    normalizeContactValue(settings.social?.zalo);

  if (configuredZalo) return configuredZalo;

  return `https://zalo.me/${getPrimaryHotline(settings).replace(/\D/g, "")}`;
}
