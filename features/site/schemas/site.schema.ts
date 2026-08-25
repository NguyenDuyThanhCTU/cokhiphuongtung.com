import { z } from "zod";
import type { NavigationItem } from "@/features/site/types";
import {
  emptyStringToUndefined,
  idSchema,
  keywordsSchema,
  nullableUrlSchema,
  optionalStringSchema,
} from "@/lib/schemas/shared.schema";

const contactSchema = z
  .object({
    hotline: optionalStringSchema,
    phoneSecondary: optionalStringSchema,
    email: optionalStringSchema,
    emailSecondary: optionalStringSchema,
    zalo: optionalStringSchema,
  })
  .optional();

const workingHoursSchema = z
  .object({
    weekday: optionalStringSchema,
    weekend: optionalStringSchema,
  })
  .optional();

const socialSchema = z
  .object({
    facebook: optionalStringSchema,
    messenger: optionalStringSchema,
    zaloChat: optionalStringSchema,
    zalo: optionalStringSchema,
    whatsapp: optionalStringSchema,
    telegram: optionalStringSchema,
    youtube: optionalStringSchema,
    tiktok: optionalStringSchema,
    instagram: optionalStringSchema,
    linkedin: optionalStringSchema,
    twitter: optionalStringSchema,
    pinterest: optionalStringSchema,
  })
  .optional();

const trackingSchema = z
  .object({
    ga4Id: optionalStringSchema,
    gtmId: optionalStringSchema,
    fbPixel: optionalStringSchema,
    tiktokPixel: optionalStringSchema,
  })
  .optional();

const verificationSchema = z
  .object({
    googleSiteVerification: optionalStringSchema,
  })
  .optional();

const publicScriptsSchema = z
  .object({
    header: optionalStringSchema,
    body: optionalStringSchema,
  })
  .optional();

export const publicSiteSettingsSchema = z.object({
  websiteId: idSchema.optional(),

  domain: optionalStringSchema,
  frontendUrl: nullableUrlSchema,

  siteName: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).default("Website"),
  ),

  slogan: optionalStringSchema,

  logoUrl: nullableUrlSchema,
  footerLogoUrl: nullableUrlSchema,
  faviconUrl: nullableUrlSchema,
  ogImageUrl: nullableUrlSchema,

  description: optionalStringSchema,

  hotline: optionalStringSchema,
  email: optionalStringSchema,
  address: optionalStringSchema,

  contact: contactSchema,

  mapIframe: optionalStringSchema,
  workingHours: workingHoursSchema,
  social: socialSchema,

  seo: z
    .object({
      title: optionalStringSchema,
      description: optionalStringSchema,
      keywords: keywordsSchema,
      ogImage: nullableUrlSchema,

      tracking: trackingSchema,
      verification: verificationSchema,
      scripts: publicScriptsSchema,
    })
    .optional(),

  activeModules: z.array(z.string()).optional().default([]),
  activeExtensions: z.array(z.string()).optional().default([]),
});

export const navigationItemSchema: z.ZodType<NavigationItem> = z.lazy(() =>
  z.object({
    id: idSchema,
    label: z.string().min(1),
    href: z.string().min(1),
    target: z.enum(["_self", "_blank"]).optional(),
    children: z.array(navigationItemSchema).optional(),
  }),
);

export const navigationSchema = z.array(navigationItemSchema);
