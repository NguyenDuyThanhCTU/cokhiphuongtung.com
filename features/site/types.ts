import type { ActiveModule, ID, UrlString } from "@/lib/types/shared";

export type PublicSocialSettings = {
  facebook?: string | null;
  messenger?: string | null;
  zaloChat?: string | null;
  zalo?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  pinterest?: string | null;
};

export type PublicSiteSettings = {
  websiteId?: ID;
  domain?: string | null;
  frontendUrl?: UrlString | null;
  siteName: string;
  slogan?: string | null;
  logoUrl?: UrlString | null;
  footerLogoUrl?: UrlString | null;
  faviconUrl?: UrlString | null;
  ogImageUrl?: UrlString | null;
  description?: string | null;
  hotline?: string | null;
  email?: string | null;
  address?: string | null;
  contact?: {
    hotline?: string | null;
    phoneSecondary?: string | null;
    email?: string | null;
    emailSecondary?: string | null;
    zalo?: string | null;
  };
  mapIframe?: string | null;
  workingHours?: {
    weekday?: string | null;
    weekend?: string | null;
  };
  social?: PublicSocialSettings;
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[] | string | null;
    ogImage?: UrlString | null;

    meta?: {
      homeTitle?: string | null;
      homeDescription?: string | null;
      homeKeywords?: string[] | string | null;
    };

    tracking?: {
      ga4Id?: string | null;
      gtmId?: string | null;
      fbPixel?: string | null;
      tiktokPixel?: string | null;
    };

    verification?: {
      googleSiteVerification?: string | null;
    };

    scripts?: {
      header?: string | null;
      body?: string | null;
    };
  };
  branches?: Array<{
    name?: string;
    address?: string;
    phone?: string;
    mapIframe?: string;
  }>;

  partners?: Array<{
    name?: string;
    logoUrl?: UrlString;
    websiteUrl?: UrlString;
  }>;
  activeModules?: ActiveModule[] | string[];
  activeExtensions?: string[];
};

export type NavigationItem = {
  id: ID;
  label: string;
  href: string;
  target?: "_self" | "_blank";
  children?: NavigationItem[];
};
