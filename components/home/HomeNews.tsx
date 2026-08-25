import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import type { BlogPost } from "@/features/content/types";
import { formatDate } from "@/lib/utils/format-date";

export const BlogCard = ({ Data }: { Data: BlogPost }) => {
  const date = Data.publishedAt ?? Data.createdAt;
  return (
    <Link href={`/bai-viet/${Data.slug}`} className="block cursor-pointer rounded-lg border border-gray-300 bg-white">
      <article className="p-4">
        <div className="grid grid-cols-6 gap-5">
          <div className="col-span-2 h-[200px]">
            {Data.thumbnailUrl ? <Image src={Data.thumbnailUrl} alt={Data.title} width={400} height={400} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200" />}
          </div>
          <div className="col-span-4 font-bold text-mainColorHover"><h2>{Data.title}</h2>{Data.excerpt ? <p className="mt-2 text-[12px] font-light text-black">{Data.excerpt} ...</p> : null}</div>
        </div>
        <div className="mt-4 flex items-center justify-between border-y border-gray-200 py-1 text-[14px] text-mainColorHover"><p>{date ? formatDate(date) : ""}</p><span className="duration-300 hover:text-blue-500">Xem thêm</span></div>
      </article>
    </Link>
  );
};

export default function HomeNews({ Data }: { Data: BlogPost[] }) {
  return (
    <section className="bg-white py-16 d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-UTMFleur text-[38px] leading-none text-mainColorHover">Chuyện nghề & cảm hứng</p>
            <h2 className="mt-3 font-UTMAmericanSans text-[31px] uppercase tracking-[0.08em] text-[#2d2116] d:text-[40px]">Tin tức</h2>
          </div>
          <Link href="/chuyen-muc" className="inline-flex items-center gap-2 border-b border-mainColorHover pb-1 text-sm font-semibold text-mainColorHover transition hover:text-mainColor">Xem tất cả bài viết <ArrowRight size={17} aria-hidden="true" /></Link>
        </header>

        {Data.length ? (
          <div className="mt-9 grid gap-6 sm:grid-cols-2 d:grid-cols-3">
            {Data.slice(0, 6).map((item) => {
              const date = item.publishedAt ?? item.createdAt;
              return (
                <article key={item.id} className="group overflow-hidden border border-[#dfd2b5] bg-[#fffdf8] shadow-[0_8px_24px_rgba(59,40,20,.07)]">
                  <Link href={`/bai-viet/${item.slug}`} className="relative block h-[230px] overflow-hidden bg-stone-100">
                    {item.thumbnailUrl ? <Image src={item.thumbnailUrl} alt={item.title} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center font-UTMFleur text-4xl text-mainColorHover">Phương Tùng</div>}
                    <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                  </Link>
                  <div className="p-5">
                    {date ? <p className="flex items-center gap-2 text-xs text-stone-500"><CalendarDays size={14} className="text-mainColorHover" aria-hidden="true" />{formatDate(date)}</p> : null}
                    <h3 className="mt-3 font-iCielPequena text-[20px] uppercase leading-7 text-[#332514]"><Link href={`/bai-viet/${item.slug}`} className="transition hover:text-mainColorHover">{item.title}</Link></h3>
                    {item.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">{item.excerpt}</p> : null}
                    <Link href={`/bai-viet/${item.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mainColorHover">Xem thêm <ArrowRight size={15} aria-hidden="true" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-9 border border-dashed border-mainColorHover/35 bg-[#fffdf8] px-6 py-10 text-center text-sm text-stone-500">Tin tức đang được cập nhật.</div>
        )}
      </div>
    </section>
  );
}
