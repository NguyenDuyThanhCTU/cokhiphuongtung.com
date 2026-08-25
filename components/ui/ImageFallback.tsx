"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type ImageFallbackProps = {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function ImageFallback({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImageFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const shouldRenderFallback = !src || hasError;

  if (shouldRenderFallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-zinc-100 text-xs font-medium text-zinc-500",
          className,
        )}
        style={{ width, height }}
        aria-label={alt}
      >
        Image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setHasError(true)}
    />
  );
}
