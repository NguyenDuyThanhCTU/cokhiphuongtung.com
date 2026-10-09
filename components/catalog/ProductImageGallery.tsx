"use client";

import Image from "next/image";
import { useState } from "react";

import { ProductImageZoom } from "@/components/catalog/ProductImageZoom";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!selectedImage) {
    return (
      <div className="flex min-h-[420px] w-full items-center justify-center border-2 border-mainColorHover bg-white text-gray-500">
        Hình ảnh đang cập nhật
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex min-h-[420px] w-full items-center justify-center border-2 border-mainColorHover bg-white">
        <ProductImageZoom
          key={selectedImage}
          src={selectedImage}
          alt={title}
        />
      </div>

      {images.length > 1 ? (
        <div
          className="grid grid-cols-4 gap-2 sm:grid-cols-5"
          aria-label="Ảnh sản phẩm"
        >
          {images.map((image, index) => {
            const isSelected = image === selectedImage;

            return (
              <button
                key={image}
                type="button"
                aria-label={`Xem ảnh ${index + 1} của ${title}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedImage(image)}
                className={`relative h-20 overflow-hidden border-2 bg-white transition sm:h-24 ${
                  isSelected
                    ? "border-mainColor ring-2 ring-mainColor/30"
                    : "border-gray-200 hover:border-mainColorHover"
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} - ảnh ${index + 1}`}
                  fill
                  sizes="(max-width: 639px) 25vw, 120px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
