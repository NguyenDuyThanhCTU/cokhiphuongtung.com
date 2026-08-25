import Image from "next/image";
import { Quote, Star } from "lucide-react";

import type { Testimonial } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

function clampRating(rating?: number | null) {
  if (typeof rating !== "number" || !Number.isFinite(rating)) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

export default function CustomerReviewSection({ testimonials }: { settings: PublicSiteSettings; testimonials: Testimonial[] }) {
  return (
    <section className="bg-[#f3eee4] py-16 d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-UTMFleur text-[38px] leading-none text-mainColorHover">Niềm tin được tạo nên từ chất lượng</p>
          <h2 className="mt-3 font-UTMAmericanSans text-[31px] uppercase tracking-[0.08em] text-[#2d2116] d:text-[40px]">Đánh giá từ khách hàng</h2>
          <div className="mx-auto mt-5 flex max-w-[340px] items-center gap-3"><span className="h-px flex-1 bg-mainColorHover/40" /><span className="h-3 w-3 rotate-45 border border-mainColorHover bg-mainColor" /><span className="h-px flex-1 bg-mainColorHover/40" /></div>
        </header>

        {testimonials.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 d:grid-cols-3">
            {testimonials.map((item, index) => {
              const rating = clampRating(item.rating);
              return (
                <article key={`${item.fullName}-${index}`} className="relative flex h-full flex-col border border-[#d7c59e] bg-white p-6 shadow-[0_10px_30px_rgba(59,40,20,.08)]">
                  <Quote size={38} className="absolute right-5 top-5 text-mainColor/45" aria-hidden="true" />
                  <div className="flex items-center gap-3 pr-10">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-mainColor bg-[#f7f0d8] font-UTMAmericanSans text-xl text-mainColorHover">
                      {item.avatarUrl ? <Image src={item.avatarUrl} alt={item.fullName} fill sizes="56px" className="object-cover" /> : item.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div><h3 className="font-iCielPequena text-[19px] uppercase text-[#332514]">{item.fullName}</h3>{item.position ? <p className="mt-1 text-xs text-stone-500">{item.position}</p> : null}</div>
                  </div>
                  <div className="mt-5 flex gap-1" aria-label={`${rating} trên 5 sao`}>{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={16} className={starIndex < rating ? "fill-mainColor text-mainColor" : "text-stone-200"} />)}</div>
                  <p className="mt-5 flex-1 text-sm italic leading-7 text-stone-600">“{item.content}”</p>
                  <div className="mt-5 flex items-center gap-2"><span className="h-px flex-1 bg-[#e2d6bb]" /><span className="h-2 w-2 rotate-45 bg-mainColorHover" /></div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-mainColorHover/35 bg-white px-6 py-10 text-center text-sm text-stone-500">Đánh giá từ khách hàng đang được cập nhật.</div>
        )}
      </div>
    </section>
  );
}
