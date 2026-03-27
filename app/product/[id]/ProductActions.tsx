"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawerStore } from "@/components/Navbar";

const SIZES = ["7", "8", "9", "10", "11", "12"];

export default function ProductActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const { setOpen } = useCartDrawerStore();
  const availableSizes = product.sizes || SIZES;

  const handleAdd = () => {
    if (!selectedSize) {
      setError("Please select a size to continue.");
      return;
    }
    setError("");
    addItem(product, selectedSize, quantity);

    // Success feedback
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setOpen(true); // open cart drawer
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm uppercase tracking-widest">
            Select Size <span className="text-accent">*</span>
          </h4>
          <button className="text-text-secondary text-xs underline hover:text-white transition-colors">
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setError(""); }}
              className={`w-12 h-12 rounded-lg border text-sm font-medium transition-all duration-200 ${
                selectedSize === size
                  ? "bg-accent border-accent text-white shadow-[0_4px_15px_rgba(255,60,0,0.3)]"
                  : "bg-transparent border-border text-text-secondary hover:border-white hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        {/* Qty */}
        <div className="flex items-center border border-border rounded-xl overflow-hidden shrink-0">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-14 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-lg"
          >
            −
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-11 h-14 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-lg"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={added}
          className={`flex-1 h-14 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 ${
            added
              ? "bg-green-500 text-white scale-[0.98]"
              : "bg-accent hover:bg-accent-hover text-white hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,60,0,0.4)]"
          }`}
        >
          {added ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
