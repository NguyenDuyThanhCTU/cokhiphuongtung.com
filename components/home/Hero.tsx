"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { BannerItem } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";

type HeroProps = { Data: BannerItem[]; settings: PublicSiteSettings };

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function Hero({ Data, settings }: HeroProps) {
  const banners = Data.filter((banner) => Boolean(banner.imageUrl));
  const hasMultipleBanners = banners.length > 1;
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!banners.length) {
    return <div className="flex min-h-[360px] items-center justify-center bg-black px-4 text-center text-white"><div><h1 className="text-3xl font-semibold uppercase text-mainColor">{settings.siteName}</h1><p className="mt-3">{settings.slogan}</p></div></div>;
  }

  return (
    <section
      aria-label="Banner trang chủ"
      data-reduced-motion={prefersReducedMotion}
    >
      <Swiper
        key={prefersReducedMotion ? "reduced-motion" : "full-motion"}
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={0}
        speed={prefersReducedMotion ? 0 : 650}
        loop={hasMultipleBanners}
        loopPreventsSliding
        watchOverflow
        navigation={hasMultipleBanners}
        pagination={hasMultipleBanners ? { clickable: true, dynamicBullets: true } : false}
        autoplay={
          hasMultipleBanners
            ? {
                delay: 4000,
                disableOnInteraction: false,
                waitForTransition: false,
              }
            : false
        }
        grabCursor={hasMultipleBanners}
        className="relative"
      >
        {banners.map((item, index) => (
          <SwiperSlide key={item.id}>
            <Link href={item.linkUrl || "/"}>
              <Image
                src={item.imageUrl || ""}
                alt={item.title || "Banner trang chủ"}
                width={1920}
                height={900}
                priority={index === 0}
                sizes="100vw"
                draggable={false}
                className="w-full object-cover p:h-auto d:h-[70vh]"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
