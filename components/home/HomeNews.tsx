import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";

import type { BlogPost } from "@/features/content/types";
import { formatDate } from "@/lib/utils/format-date";

export const BlogCard = ({ Data }: { Data: BlogPost }) => {
  const displayDate = Data.publishedAt ?? Data.createdAt;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
      <Link href={`/bai-viet/${Data.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100" aria-label={Data.title}>
        {Data.thumbnailUrl ? (
          <Image src={Data.thumbnailUrl} alt={Data.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 text-brand-700"><BookOpen size={40} /></div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {displayDate ? <p className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarDays size={15} className="text-brand-600" />{formatDate(displayDate)}</p> : null}
        <h3 className="mt-3 text-lg font-extrabold leading-snug text-slate-950"><Link href={`/bai-viet/${Data.slug}`} className="transition hover:text-brand-700">{Data.title}</Link></h3>
        {Data.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{Data.excerpt}</p> : null}
        <Link href={`/bai-viet/${Data.slug}`} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-brand-700">Đọc bài viết <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
};

const HomeNews = ({ Data }: { Data: BlogPost[] }) => {
  if (!Data?.length) return null;

  return (
    <section className="bg-white py-14 d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Cẩm nang hành trình</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Thông tin hữu ích về Hà Giang</h2>
          </div>
          <Link href="/chuyen-muc" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">Xem tất cả bài viết <ArrowRight size={17} /></Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 d:grid-cols-3">
          {Data.slice(0, 3).map((item) => <BlogCard key={item.id} Data={item} />)}
        </div>
      </div>
    </section>
  );
};

export default HomeNews;
