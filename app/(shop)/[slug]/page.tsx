import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { getStaticPageBySlug } from "@/features/content/services/content.service";
import { StaticPageContent } from "@/components/StaticPage/StaticPageContent";

type StaticPageProps = {
  params: {
    slug: string;
  };
};

async function loadStaticPage(slug: string) {
  try {
    return await getStaticPageBySlug(slug);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load static page.", error);
    }
    notFound();
  }
}

export async function generateMetadata({
  params,
}: StaticPageProps): Promise<Metadata> {
  const page = await loadStaticPage(params.slug);

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.title,
  };
}

export default async function StaticPage({ params }: StaticPageProps) {
  const page = await loadStaticPage(params.slug);

  return (
    <>
      <StaticPageContent page={page} />
    </>
  );
}
