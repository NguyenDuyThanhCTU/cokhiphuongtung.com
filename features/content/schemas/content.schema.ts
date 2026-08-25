import { z } from "zod";
import { idSchema, nullableUrlSchema, optionalStringSchema } from "@/lib/schemas/shared.schema";
import { normalizeString } from "@/lib/utils/api-normalizers";

export const faqCategorySchema = z.preprocess((value) => {
  const normalized = normalizeString(value);
  if (normalized) {
    return normalized;
  }

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    return normalizeString(record.name) ?? normalizeString(record.title);
  }

  return undefined;
}, z.string().min(1).optional());

export const bannerItemSchema = z.object({
  id: idSchema,
  title: optionalStringSchema,
  subtitle: optionalStringSchema,
  imageUrl: nullableUrlSchema,
  linkUrl: optionalStringSchema,
  buttonText: optionalStringSchema,
  sortOrder: z.number().optional(),
});

export const postCategorySchema: z.ZodType<{
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Array<{
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    description?: string | null;
    isActive: boolean;
  }>;
  description?: string | null;
  isActive: boolean;
}> = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: idSchema.nullable().optional(),
  children: z
    .array(
      z.object({
        id: idSchema,
        name: z.string().min(1),
        slug: z.string().min(1),
        parentId: idSchema.nullable().optional(),
        description: optionalStringSchema,
        isActive: z.boolean().default(true),
      }),
    )
    .optional(),
  description: optionalStringSchema,
  isActive: z.boolean().default(true),
});

export const blogPostSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: optionalStringSchema,
  content: z.string().nullable().optional(),
  thumbnailUrl: nullableUrlSchema,
  category: postCategorySchema.nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().min(1).nullable().optional(),
  createdAt: z.string().min(1).optional(),
  seoTitle: optionalStringSchema,
  seoDescription: optionalStringSchema,
  ogImage: nullableUrlSchema,
});

export const staticPageSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().default(""),
  seoTitle: optionalStringSchema,
  seoDescription: optionalStringSchema,
});

export const faqItemSchema = z.object({
  id: idSchema,
  question: z.string().min(1),
  answer: z.string().min(1),
  category: faqCategorySchema,
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z
  .object({
    id: idSchema,
    fullName: optionalStringSchema,
    name: optionalStringSchema,
    customerName: optionalStringSchema,
    authorName: optionalStringSchema,
    displayName: optionalStringSchema,
    title: optionalStringSchema,
    avatarUrl: nullableUrlSchema,
    imageUrl: nullableUrlSchema,
    position: optionalStringSchema,
    content: optionalStringSchema,
    message: optionalStringSchema,
    quote: optionalStringSchema,
    rating: z.number().min(1).max(5).nullable().optional(),
    isFeatured: z.boolean().optional(),
    sortOrder: z.number().optional(),
  })
  .passthrough()
  .transform((item) => {
    const fullName =
      item.fullName ??
      item.name ??
      item.customerName ??
      item.authorName ??
      item.displayName ??
      item.title ??
      "Khách hàng";
    const content = item.content ?? item.message ?? item.quote ?? "";

    return {
      ...item,
      fullName,
      content,
      avatarUrl: item.avatarUrl ?? item.imageUrl,
    };
  })
  .refine((item) => Boolean(item.content), {
    path: ["content"],
    message: "Missing testimonial content/message/quote",
  });

export const homeContentSchema = z.object({
  banners: z.array(bannerItemSchema).optional(),
  featuredPosts: z.array(blogPostSchema).optional(),
  faqs: z.array(faqItemSchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
});

export const bannerListSchema = z.array(bannerItemSchema);
export const blogPostListSchema = z.array(blogPostSchema);
export const postCategoryListSchema = z.array(postCategorySchema);
export const faqListSchema = z.array(faqItemSchema);
export const testimonialListSchema = z.array(testimonialSchema);
