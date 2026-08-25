import type { PublicSiteSettings } from "@/features/site/types";
import { getZaloHref } from "@/features/site/utils/contact";

export type SocialChannelId =
  | "facebook"
  | "messenger"
  | "zalo"
  | "tiktok"
  | "instagram";

export type SocialChannel = {
  id: SocialChannelId;
  label: string;
  href: string;
};

const CHANNEL_LABELS: Record<SocialChannelId, string> = {
  facebook: "Facebook Fanpage",
  messenger: "Messenger",
  zalo: "Zalo",
  tiktok: "TikTok",
  instagram: "Instagram",
};

function normalizeSocialValue(value?: string | null): string {
  return value?.trim() ?? "";
}

function isDomainOrUrlPath(value: string): boolean {
  return /^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:[/:?#].*)?$/i.test(value);
}

export function normalizeSocialHref(
  channel: SocialChannelId,
  value?: string | null,
): string {
  const normalized = normalizeSocialValue(value);
  if (!normalized) return "";

  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith("//")) return `https:${normalized}`;

  // Reject unexpected protocols instead of exposing unsafe href values.
  if (/^[a-z][a-z0-9+.-]*:/i.test(normalized)) return "";
  if (isDomainOrUrlPath(normalized)) return `https://${normalized}`;

  const handle = normalized.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
  if (!handle) return "";

  const encodedHandle = encodeURIComponent(handle);
  switch (channel) {
    case "facebook":
      return `https://www.facebook.com/${encodedHandle}`;
    case "messenger":
      return `https://m.me/${encodedHandle}`;
    case "zalo": {
      const phone = handle.replace(/\D/g, "");
      return phone ? `https://zalo.me/${phone}` : "";
    }
    case "tiktok":
      return `https://www.tiktok.com/@${encodedHandle}`;
    case "instagram":
      return `https://www.instagram.com/${encodedHandle}`;
  }
}

export function getSocialChannels(
  settings: PublicSiteSettings,
): SocialChannel[] {
  const configuredChannels: Array<{
    id: SocialChannelId;
    value?: string | null;
  }> = [
    { id: "facebook", value: settings.social?.facebook },
    { id: "messenger", value: settings.social?.messenger },
    { id: "zalo", value: getZaloHref(settings) },
    { id: "tiktok", value: settings.social?.tiktok },
    { id: "instagram", value: settings.social?.instagram },
  ];

  return configuredChannels.flatMap(({ id, value }) => {
    const href = normalizeSocialHref(id, value);
    return href ? [{ id, label: CHANNEL_LABELS[id], href }] : [];
  });
}
