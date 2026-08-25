import Hero from "@/components/home/Hero";
import HomeGallery from "@/components/home/HomeGallery";
import HomeIntro from "@/components/home/HomeIntro";
import HomeProducts from "@/components/home/HomeProducts";
import { getCatalogCategories, getCatalogItems } from "@/features/catalog/services/catalog.service";
import { getBanners, getBlogPosts } from "@/features/content/services/content.service";
import { getPostsInGroup } from "@/features/content/utils/post-groups";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

export default async function Home() {
  const [settings, banners, categories, catalog, posts] = await Promise.all([
    getPublicSiteSettings(),
    getBanners(),
    getCatalogCategories(),
    getCatalogItems({ limit: 100, sort: "sort_order" }),
    getBlogPosts(),
  ]);
  const introduction = posts.find((post) => post.slug === "gioi-thieu" || post.id === "introductory") ?? posts[0];
  const projects = getPostsInGroup(posts, "du-an");
  const videos = getPostsInGroup(posts, "video");

  return (
    <div className="mb-3">
      <Hero Data={banners} settings={settings} />
      <div className="mx-auto mt-5 flex flex-col gap-4 p:w-auto d:w-[1200px]">
        <HomeIntro post={introduction} settings={settings} />
        <HomeProducts Data={catalog.items} categories={categories} settings={settings} />
        <HomeGallery images={projects} videos={videos} />
      </div>
    </div>
  );
}
