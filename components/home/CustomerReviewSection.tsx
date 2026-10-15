/* Hallmark · pre-emit critique: P4 H4 E5 S5 R5 V4 */
"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { A11y, Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Testimonial } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

function clampRating(rating?: number | null) {
  if (typeof rating !== "number" || !Number.isFinite(rating)) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

function ReviewCard({ item }: { item: Testimonial }) {
  const rating = clampRating(item.rating);

  return (
    <article className="relative flex h-full flex-col border border-[#d7c59e] bg-white p-6 shadow-[0_10px_30px_rgba(59,40,20,.08)]">
      <Quote size={38} className="absolute right-5 top-5 text-mainColor/45" aria-hidden="true" />
      <div className="flex items-center gap-3 pr-10">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-mainColor bg-[#f7f0d8] font-UTMAmericanSans text-xl text-mainColorHover">
          {item.avatarUrl ? <Image src={item.avatarUrl} alt={item.fullName} fill sizes="56px" className="object-cover" /> : item.fullName.charAt(0).toUpperCase()}
        </div>
        <div><h3 className="font-iCielPequena text-[19px] uppercase text-[#332514]">{item.fullName}</h3>{item.position ? <p className="mt-1 text-xs text-stone-500">{item.position}</p> : null}</div>
      </div>
      <div className="mt-5 flex gap-1" aria-label={`${rating} trên 5 sao`}>{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={16} className={starIndex < rating ? "fill-mainColor text-mainColor" : "text-stone-200"} aria-hidden="true" />)}</div>
      <p className="mt-5 flex-1 text-sm italic leading-7 text-black font-medium">“{item.content}”</p>
      <div className="mt-5 flex items-center gap-2"><span className="h-px flex-1 bg-[#e2d6bb]" /><span className="h-2 w-2 rotate-45 bg-mainColorHover" /></div>
    </article>
  );
}

export default function CustomerReviewSection({ testimonials }: { settings: PublicSiteSettings; testimonials: Testimonial[] }) {
  const hasMoreThanOnePage = testimonials.length > 6;
  const testimonialPages = Array.from(
    { length: Math.ceil(testimonials.length / 6) },
    (_, pageIndex) => testimonials.slice(pageIndex * 6, pageIndex * 6 + 6),
  );

  return (
    <section className="bg-[#f3eee4] py-16 d:py-20">
      <div className="w-full px-4 sm:px-6 d:px-5">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-UTMFleur text-[38px] leading-none text-mainColorHover">Niềm tin được tạo nên từ chất lượng</p>
          <h2 className="mt-3 font-UTMAmericanSans text-[31px] uppercase tracking-[0.08em] text-[#2d2116] d:text-[40px]">Đánh giá từ khách hàng</h2>
          <div className="mx-auto mt-5 flex max-w-[340px] items-center gap-3"><span className="h-px flex-1 bg-mainColorHover/40" /><span className="h-3 w-3 rotate-45 border border-mainColorHover bg-mainColor" /><span className="h-px flex-1 bg-mainColorHover/40" /></div>
        </header>

        {hasMoreThanOnePage ? (
          <div className="customer-review-carousel mt-10">
            <Swiper
              modules={[A11y, Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={24}
              navigation={{
                prevEl: ".customer-review-prev",
                nextEl: ".customer-review-next",
              }}
              pagination={{
                el: ".customer-review-pagination",
                clickable: true,
              }}
              watchOverflow
              grabCursor
              a11y={{
                enabled: true,
                prevSlideMessage: "Xem các đánh giá trước",
                nextSlideMessage: "Xem các đánh giá tiếp theo",
                firstSlideMessage: "Đây là nhóm đánh giá đầu tiên",
                lastSlideMessage: "Đây là nhóm đánh giá cuối cùng",
                paginationBulletMessage: "Chuyển đến nhóm đánh giá {{index}}",
                containerMessage: "Danh sách đánh giá từ khách hàng",
                slideLabelMessage: "Nhóm đánh giá {{index}} trên {{slidesLength}}",
              }}
              autoplay={
                { delay: 4000,
                disableOnInteraction: false,
                waitForTransition: false,}
              }
              className="customer-review-swiper"
            >
              {testimonialPages.map((page, pageIndex) => (
                <SwiperSlide key={`testimonial-page-${pageIndex}`} className="h-auto">
                  <div className="grid gap-5 sm:grid-cols-2 d:grid-cols-3">
                    {page.map((item) => <ReviewCard key={item.id} item={item} />)}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="customer-review-controls" aria-label="Điều khiển danh sách đánh giá">
              <button type="button" className="customer-review-prev" aria-label="Xem các đánh giá trước">
                <ChevronLeft size={15} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <div className="customer-review-pagination" />
              <button type="button" className="customer-review-next" aria-label="Xem các đánh giá tiếp theo">
                <ChevronRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : testimonials.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 d:grid-cols-3">
            {testimonials.map((item) => <ReviewCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-mainColorHover/35 bg-white px-6 py-10 text-center text-sm text-stone-500">Đánh giá từ khách hàng đang được cập nhật.</div>
        )}
      </div>
    </section>
  );
}
