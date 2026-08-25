import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { getStaticPageBySlug } from "@/features/content/services/content.service";

type PolicyDetailPageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PolicyDetailPageProps): Promise<Metadata> {
  const page = await getStaticPageBySlug(params.slug);
  const description = page.seoDescription ?? page.title;
  return { title: page.seoTitle ?? page.title, description, alternates: { canonical: `/chinh-sach/${page.slug}` }, openGraph: { title: page.seoTitle ?? page.title, description, type: "article", images: [] }, twitter: { card: "summary", title: page.seoTitle ?? page.title, description, images: [] } };
}

export default async function PolicyDetailPage({ params }: PolicyDetailPageProps) {
  const page = await getStaticPageBySlug(params.slug);
  return (
    <main className="min-h-[560px] bg-bgcontent py-10 d:py-14">
      <article className="mx-auto w-full max-w-[960px] px-4 sm:px-6">
        <Link href="/chinh-sach" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-700"><ArrowLeft size={16} /> Tất cả chính sách</Link>
        <header className="mt-6 rounded-[30px] bg-slate-950 p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-10"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-400 text-slate-950"><ShieldCheck size={24} /></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-300">Chính sách Phương Tùng</p><h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{page.title}</h1></header>
        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"><HtmlContent html={page.content} className="article-content" /></section>
      </article>
    </main>
  );
}
