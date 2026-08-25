import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Hammer } from "lucide-react";
import type { BlogPost } from "@/features/content/types";
import { formatDate } from "@/lib/utils/format-date";

export function ProjectCard({ project }: { project: BlogPost }) {
  const displayDate = project.publishedAt ?? project.createdAt;
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
      <Link href={`/du-an/${project.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-950" aria-label={project.title}>
        {project.thumbnailUrl ? <Image src={project.thumbnailUrl} alt={project.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover opacity-90 transition duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(245,184,0,0.5),transparent_35%),linear-gradient(135deg,#111827,#1f2937)] text-brand-300"><Hammer size={44} /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-brand-400 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-950">Dự án thực tế</span>
      </Link>
      <div className="p-5">
        {displayDate ? <p className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarDays size={14} className="text-brand-600" />{formatDate(displayDate)}</p> : null}
        <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-950"><Link href={`/du-an/${project.slug}`} className="transition hover:text-brand-700">{project.title}</Link></h2>
        {project.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{project.excerpt}</p> : null}
        <Link href={`/du-an/${project.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">Xem dự án <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}
