"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";

type ProductImageZoomProps = {
  src: string;
  alt: string;
};

const ZOOM_LEVEL = 3.5;
const MAX_LENS_SIZE = 360;
const MIN_LENS_SIZE = 220;
const LENS_OFFSET = 20;
const VIEWPORT_MARGIN = 16;

export function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);

    const hideLens = () => {
      if (lensRef.current) lensRef.current.style.opacity = "0";
    };

    window.addEventListener("scroll", hideLens, true);
    window.addEventListener("resize", hideLens);

    return () => {
      window.removeEventListener("scroll", hideLens, true);
      window.removeEventListener("resize", hideLens);
    };
  }, []);

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

    const rightSpace =
      window.innerWidth - bounds.right - LENS_OFFSET - VIEWPORT_MARGIN;
    const leftSpace = bounds.left - LENS_OFFSET - VIEWPORT_MARGIN;
    const availableSideSpace = Math.max(rightSpace, leftSpace);
    const lensSize = Math.min(
      MAX_LENS_SIZE,
      availableSideSpace,
      window.innerHeight - VIEWPORT_MARGIN * 2,
    );

    // The zoom result must stay fully outside the product image.
    if (lensSize < MIN_LENS_SIZE) {
      lens.style.opacity = "0";
      return;
    }

    const relativeX = x - imageLeft;
    const relativeY = y - imageTop;
    const showOnRight = rightSpace >= lensSize || rightSpace >= leftSpace;
    const lensLeft = showOnRight
      ? bounds.right + LENS_OFFSET
      : bounds.left - LENS_OFFSET - lensSize;
    const lensTop = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        bounds.top,
        window.innerHeight - lensSize - VIEWPORT_MARGIN,
      ),
    );

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
      {portalTarget
        ? createPortal(
            <div
              ref={lensRef}
              aria-hidden="true"
              className="pointer-events-none fixed z-[100] border-2 border-white bg-white bg-no-repeat opacity-0 shadow-[0_12px_36px_rgba(0,0,0,0.42)] transition-opacity duration-100"
            />,
            portalTarget,
          )
        : null}
    </div>
  );
}
