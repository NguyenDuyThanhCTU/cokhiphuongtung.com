"use client";

import Image from "next/image";
import Link from "next/link";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { BannerItem } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

type HeroProps = { Data: BannerItem[]; settings: PublicSiteSettings };

export default function Hero({ Data, settings }: HeroProps) {
  const banners = Data.filter((banner) => Boolean(banner.imageUrl));

  if (!banners.length) {
    return <div className="flex min-h-[360px] items-center justify-center bg-black px-4 text-center text-white"><div><h1 className="text-3xl font-semibold uppercase text-mainColor">{settings.siteName}</h1><p className="mt-3">{settings.slogan}</p></div></div>;
  }

  return (
    <h1>
      <Swiper modules={[Navigation, Pagination, A11y, Autoplay]} spaceBetween={30} loop centeredSlides slidesPerView={1} slidesPerGroup={1} pagination={{ clickable: true, dynamicBullets: true }} autoplay={{ delay: 2500, disableOnInteraction: false }} navigation className="relative">
        {banners.map((item) => (
          <SwiperSlide key={item.id}>
            <Link href={item.linkUrl || "/"}>
              <Image src={item.imageUrl || ""} alt={item.title || "banner"} width={1920} height={900} priority className="w-full object-cover p:h-auto d:h-[70vh]" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </h1>
  );
}
