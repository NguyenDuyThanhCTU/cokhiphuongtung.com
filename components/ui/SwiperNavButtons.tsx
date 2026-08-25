import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwiper } from "swiper/react";

type SwiperNavigationProps = {
  show?: boolean;
};

export const SwiperNavigation = ({ show = true }: SwiperNavigationProps) => {
  const swiper = useSwiper();

  if (!show) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => swiper.slidePrev()}
        className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-all hover:border-primary hover:bg-primary hover:text-[#112D4E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={() => swiper.slideNext()}
        className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-all hover:border-primary hover:bg-primary hover:text-[#112D4E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
};
