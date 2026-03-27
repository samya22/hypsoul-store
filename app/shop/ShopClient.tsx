"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface ShopClientProps {
  products: Product[];
  categories: string[];
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearch(q);
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, search]);

  return (
    <div className={`bg-bg-secondary min-h-[60vh] transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-14">

        {/* Filter / Search Bar */}
        <div className="flex flex-col gap-3 mb-6 md:mb-10">
          {/* Search — full width on mobile */}
          <div className="relative w-full">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sneakers..."
              className="w-full bg-bg-card border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white touch-manipulation"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort + result count row */}
          <div className="flex items-center justify-between gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-none bg-bg-card border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <span className="text-text-secondary text-sm shrink-0">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {/* Category Tabs — horizontally scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 md:mb-10 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium uppercase tracking-wider transition-all duration-200 touch-manipulation ${
                activeCategory === cat
                  ? "bg-accent text-white shadow-[0_4px_15px_rgba(255,60,0,0.3)]"
                  : "bg-bg-card border border-border text-text-secondary hover:text-white hover:border-white/30"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted text-2xl">
              🔍
            </div>
            <div>
              <p className="font-heading font-bold text-lg md:text-xl">No sneakers found</p>
              <p className="text-text-secondary text-sm mt-1">Try adjusting your filters or search term.</p>
            </div>
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="text-accent text-sm hover:underline mt-2 touch-manipulation"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
