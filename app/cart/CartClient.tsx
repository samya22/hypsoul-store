"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartClient() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const shipping = total >= 2999 ? 0 : 199;
  const grandTotal = total + shipping;

  return (
    <div className="min-h-screen bg-bg-primary pt-20 md:pt-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-16">

        <div className="mb-6 md:mb-10">
          <h1 className="font-heading font-black text-3xl md:text-5xl line-accent">Your Cart</h1>
          <p className="text-text-secondary mt-3 md:mt-4 text-sm md:text-base">
            {items.length === 0
              ? "Your cart is empty"
              : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-6 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted">
              <svg className="w-9 h-9 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="font-heading font-bold text-xl md:text-2xl">Nothing in here yet</p>
              <p className="text-text-secondary mt-2 text-sm md:text-base">Go find something worth wearing.</p>
            </div>
            <Link href="/shop" className="btn-primary-full mt-2 touch-manipulation">Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {/* Desktop column headers */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_40px] gap-4 text-text-muted text-xs uppercase tracking-widest pb-3 border-b border-border">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span />
              </div>

              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="p-4 md:p-5 bg-bg-card border border-border rounded-2xl group"
                >
                  {/* Mobile layout: image + info + remove in one row, qty + total below */}
                  <div className="flex gap-3 md:gap-4 items-start">
                    <Link
                      href={`/product/${item.id}`}
                      className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-bg-elevated border border-border"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-accent text-[10px] font-bold uppercase tracking-widest">
                        {item.category}
                      </span>
                      <Link
                        href={`/product/${item.id}`}
                        className="block font-heading font-bold text-sm md:text-lg mt-0.5 hover:text-accent transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-text-secondary text-xs md:text-sm mt-0.5">UK {item.size}</p>
                      <p className="text-text-muted text-xs md:text-sm">{formatPrice(item.price)} each</p>
                    </div>

                    {/* Remove button — top right on mobile */}
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="shrink-0 p-2 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 touch-manipulation"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Qty + total row — below on mobile */}
                  <div className="flex items-center justify-between mt-3 md:mt-0 pl-0 md:hidden">
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors touch-manipulation"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors touch-manipulation"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-heading font-bold text-lg text-accent">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Desktop: qty + total in grid (hidden on mobile) */}
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_40px] gap-4 items-center mt-0">
                    <div />{/* spacer for product col */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-bold text-lg text-accent">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                    <div />
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="text-text-muted text-sm hover:text-red-400 transition-colors underline touch-manipulation"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 md:top-24 bg-bg-card border border-border rounded-2xl p-4 md:p-8 space-y-4 md:space-y-5">
                <h2 className="font-heading font-bold text-lg md:text-xl">Order Summary</h2>

                <div className="space-y-2 md:space-y-3 pb-4 border-b border-border">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                      <span className="text-text-secondary line-clamp-1 flex-1 mr-2 text-xs md:text-sm">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="shrink-0 text-xs md:text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-text-muted text-xs">
                      Add {formatPrice(2999 - total)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="font-heading font-bold text-base md:text-lg">Total</span>
                  <span className="font-heading font-black text-xl md:text-2xl text-accent">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <Link href="/checkout" className="btn-primary-full w-full text-center block touch-manipulation">
                  Proceed to Checkout
                </Link>

                <Link href="/shop" className="btn-secondary-full w-full text-center block text-sm py-3 touch-manipulation">
                  Continue Shopping
                </Link>

                <div className="flex items-center justify-center gap-3 md:gap-4 pt-2 text-text-muted text-xs">
                  <span className="flex items-center gap-1">🔒 Secure checkout</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">✅ Authentic</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}