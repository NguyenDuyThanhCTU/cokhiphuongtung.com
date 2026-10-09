"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

type ProductImageZoomProps = {
  src: string;
  alt: string;
};

const ZOOM_LEVEL = 2.5;
const MAX_LENS_SIZE = 200;
const LENS_OFFSET = 18;

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const image = imageRef.current;
    const lens = lensRef.current;
    if (!image || !lens || !image.naturalWidth || !image.naturalHeight) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const imageStyles = window.getComputedStyle(image);
    const paddingLeft = Number.parseFloat(imageStyles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(imageStyles.paddingRight) || 0;
    const paddingTop = Number.parseFloat(imageStyles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(imageStyles.paddingBottom) || 0;
    const availableWidth = bounds.width - paddingLeft - paddingRight;
    const availableHeight = bounds.height - paddingTop - paddingBottom;
    const imageRatio = image.naturalWidth / image.naturalHeight;

    let renderedWidth = availableWidth;
    let renderedHeight = renderedWidth / imageRatio;
    if (renderedHeight > availableHeight) {
      renderedHeight = availableHeight;
      renderedWidth = renderedHeight * imageRatio;
    }

    const imageLeft = paddingLeft + (availableWidth - renderedWidth) / 2;
    const imageTop = paddingTop + (availableHeight - renderedHeight) / 2;
    const isOverImage =
      x >= imageLeft &&
      x <= imageLeft + renderedWidth &&
      y >= imageTop &&
      y <= imageTop + renderedHeight;

    if (!isOverImage) {
      lens.style.opacity = "0";
      return;
    }

    const lensSize = Math.min(
      MAX_LENS_SIZE,
      bounds.width * 0.45,
      bounds.height * 0.45,
    );
    const relativeX = x - imageLeft;
    const relativeY = y - imageTop;
    let lensLeft = x + LENS_OFFSET;
    let lensTop = y + LENS_OFFSET;

    if (lensLeft + lensSize > bounds.width) {
      lensLeft = x - lensSize - LENS_OFFSET;
    }
    if (lensTop + lensSize > bounds.height) {
      lensTop = y - lensSize - LENS_OFFSET;
    }

    lensLeft = Math.max(0, Math.min(lensLeft, bounds.width - lensSize));
    lensTop = Math.max(0, Math.min(lensTop, bounds.height - lensSize));

    lens.style.width = `${lensSize}px`;
    lens.style.height = `${lensSize}px`;
    lens.style.left = `${lensLeft}px`;
    lens.style.top = `${lensTop}px`;
    lens.style.backgroundImage = `url(${JSON.stringify(src)})`;
    lens.style.backgroundSize = `${renderedWidth * ZOOM_LEVEL}px ${renderedHeight * ZOOM_LEVEL}px`;
    lens.style.backgroundPosition = `${lensSize / 2 - relativeX * ZOOM_LEVEL}px ${lensSize / 2 - relativeY * ZOOM_LEVEL}px`;
    lens.style.opacity = "1";
  }

  function handlePointerLeave() {
    if (lensRef.current) {
      lensRef.current.style.opacity = "0";
    }
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden cursor-crosshair"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={1200}
        height={1200}
        priority
        draggable={false}
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="h-full max-h-[560px] w-full select-none object-contain p-2"
      />
      <div
        ref={lensRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-20 border-2 border-white bg-white bg-no-repeat opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-opacity duration-100"
      />
    </div>
  );
}
