import type { Metadata } from "next";
import { CiClock2 } from "react-icons/ci";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { getBlogPostBySlug } from "@/features/content/services/content.service";
import { formatDate } from "@/lib/utils/format-date";

type Props = { params: { slug: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const project = await getBlogPostBySlug(params.slug); return { title: project.seoTitle ?? project.title, description: project.seoDescription ?? project.excerpt ?? project.title }; }
export default async function ProjectDetailPage({ params }: Props) { const project = await getBlogPostBySlug(params.slug); const date = project.publishedAt ?? project.createdAt; return <article className="rounded-lg border border-gray-300 bg-white p-4"><h1 className="text-[20px] font-normal text-mainColorHover">{project.title}</h1>{date ? <div className="flex items-center gap-2 text-[14px]"><CiClock2 /><p>{formatDate(date)}</p></div> : null}{project.content ? <HtmlContent html={project.content} className="mt-4" /> : null}</article>; }
