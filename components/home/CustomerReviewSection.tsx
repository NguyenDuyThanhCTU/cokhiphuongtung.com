import Image from "next/image";
import { Quote, Star } from "lucide-react";

import type { Testimonial } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

function clampRating(rating?: number | null) {
  if (typeof rating !== "number" || !Number.isFinite(rating)) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

export default function CustomerReviewSection({ testimonials }: { settings: PublicSiteSettings; testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null;

  return (
    <section className="bg-white py-14 d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Phản hồi hành khách</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Trải nghiệm từ khách hàng</h2>
        </div>
        <div className="mt-9 grid gap-5 d:grid-cols-3">
          {testimonials.slice(0, 3).map((item, index) => {
            const rating = clampRating(item.rating);
            return (
              <article key={`${item.fullName}-${index}`} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-black text-brand-800">
                      {item.avatarUrl ? <Image src={item.avatarUrl} alt={item.fullName} fill sizes="48px" className="object-cover" /> : item.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div><h3 className="font-extrabold text-slate-950">{item.fullName}</h3>{item.position ? <p className="mt-1 text-xs text-slate-500">{item.position}</p> : null}</div>
                  </div>
                  <Quote size={25} className="text-brand-400" />
                </div>
                <div className="mt-5 flex gap-1" aria-label={`${rating} trên 5 sao`}>
                  {Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={16} className={starIndex < rating ? "fill-brand-400 text-brand-400" : "text-slate-200"} />)}
                </div>
                <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">“{item.content}”</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
