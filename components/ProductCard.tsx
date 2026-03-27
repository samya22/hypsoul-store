"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-bg-card border border-border rounded-2xl overflow-hidden product-card-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-bg-elevated">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={priority}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick view btn — hidden on mobile (no hover on touch) */}
        <div className="hidden md:flex absolute bottom-4 left-0 right-0 justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white text-black text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full">
            Quick View
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-accent text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
              New
            </span>
          )}
          {product.category === "Limited Edition" || product.category === "Collector" ? (
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
              Limited
            </span>
          ) : null}
        </div>

        {/* Stock warning */}
        {product.stock !== undefined && product.stock <= 5 && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <span className="bg-black/70 backdrop-blur-sm text-orange-400 text-[9px] md:text-[10px] font-semibold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full border border-orange-400/30">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-5">
        <span className="text-accent text-[10px] md:text-[11px] font-semibold uppercase tracking-widest">
          {product.category}
        </span>
        <h3 className="font-heading font-bold text-sm md:text-lg mt-0.5 md:mt-1 mb-2 md:mb-3 group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-heading font-black text-base md:text-xl">
            {formatPrice(product.price)}
          </span>
          {/* Arrow button — smaller on mobile */}
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 shrink-0">
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-accent group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
