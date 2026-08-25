import CategoryPageShell from "@/components/layout/CategoryPageShell";
import { getCatalogCategories } from "@/features/catalog/services/catalog.service";
import { getBlogPosts } from "@/features/content/services/content.service";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [categories, posts] = await Promise.all([getCatalogCategories(), getBlogPosts()]);
  return <CategoryPageShell categories={categories} posts={posts}>{children}</CategoryPageShell>;
}
