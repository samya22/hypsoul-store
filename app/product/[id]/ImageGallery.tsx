"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
  isNew?: boolean;
  category?: string;
}

export default function ImageGallery({ images, name, isNew, category }: Props) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="sticky top-24">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-bg-card border border-border">
        <Image
          src={images[current]}
          alt={`${name} view ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isNew && (
            <span className="bg-accent text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              New Drop
            </span>
          )}
          {(category === "Limited Edition" || category === "Collector") && (
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Limited
            </span>
          )}
        </div>

        {/* Arrows — only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 border border-white/10 text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-accent w-4" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}