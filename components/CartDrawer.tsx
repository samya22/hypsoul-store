"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useCartDrawerStore } from "./Navbar";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { open, setOpen } = useCartDrawerStore();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const total = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] bg-bg-secondary border-l border-border flex flex-col transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-heading font-bold text-xl">Your Cart</h2>
            <p className="text-text-secondary text-xs mt-0.5">
              {items.length === 0 ? "Empty" : `${items.reduce((s, i) => s + i.quantity, 0)} items`}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-16 h-16 rounded-full bg-bg-card flex items-center justify-center text-text-muted">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-semibold text-lg">Bag is empty</p>
                <p className="text-text-secondary text-sm mt-1">Add your first pair to get started.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="btn-primary-full text-sm px-6 py-3 mt-2"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 p-3 rounded-xl bg-bg-card border border-border/50 group"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-bg-elevated"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="font-heading font-semibold text-sm leading-snug hover:text-accent transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="shrink-0 text-text-muted hover:text-red-400 transition-colors mt-0.5"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">UK {item.size}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    {/* Qty */}
                    <div className="flex items-center gap-1 bg-bg-elevated rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-accent font-bold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Subtotal</span>
              <span className="font-heading font-bold text-lg">{formatPrice(total)}</span>
            </div>
            <p className="text-text-muted text-xs">Shipping & taxes calculated at checkout</p>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary-full w-full text-center block"
              >
                Checkout — {formatPrice(total)}
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="btn-secondary-full w-full text-center block text-sm py-3"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
