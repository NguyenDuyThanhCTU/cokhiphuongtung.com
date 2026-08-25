import type { ID, ISODateString, PublishStatus, UrlString } from "@/lib/types/shared";

export type BannerItem = {
  id: ID;
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: UrlString | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  sortOrder?: number;
};

export type PostCategory = {
  id: ID;
  name: string;
  slug: string;
  parentId?: ID | null;
  children?: PostCategory[];
  description?: string | null;
  isActive: boolean;
};

export type BlogPost = {
  id: ID;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  thumbnailUrl?: UrlString | null;
  category?: PostCategory | null;
  status?: PublishStatus;
  publishedAt?: ISODateString | null;
  createdAt?: ISODateString;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: UrlString | null;
};

export type StaticPage = {
  id: ID;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type FaqItem = {
  id: ID;
  question: string;
  answer: string;
  category?: string | null;
  isFeatured?: boolean;
  sortOrder?: number;
  isActive: boolean;
};

export type Testimonial = {
  id: ID;
  fullName: string;
  avatarUrl?: UrlString | null;
  position?: string | null;
  content: string;
  rating?: number | null;
  isFeatured?: boolean;
};

export type HomeContent = {
  banners?: BannerItem[];
  featuredPosts?: BlogPost[];
  faqs?: FaqItem[];
  testimonials?: Testimonial[];
};
