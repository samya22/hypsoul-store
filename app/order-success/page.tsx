"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import type { InvoiceData } from "@/lib/invoice";

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentId?: string;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
  };
}

async function downloadInvoice(order: Order) {
  const { generateInvoicePDF } = await import("@/lib/invoice");
  const invoiceData: InvoiceData = {
    orderId: order.id,
    createdAt: order.createdAt,
    paymentMethod: order.paymentMethod,
    paymentId: order.paymentId ?? null,
    customer: order.customer,
    items: order.items as any,
    total: order.total,
  };
  generateInvoicePDF(invoiceData);
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setLoadError(true);
      })
      .catch(() => setLoadError(true));
  }, [orderId]);

  const handleDownload = useCallback(async () => {
    if (!order) return;
    setDownloading(true);
    try {
      await downloadInvoice(order);
    } finally {
      setDownloading(false);
    }
  }, [order]);

  if (!order && !loadError) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-text-secondary text-sm uppercase tracking-widest">Loading your order…</p>
        </div>
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-5">
        <div className="text-center space-y-4">
          <p className="font-heading font-bold text-2xl">Order not found</p>
          <p className="text-text-secondary">We couldn&apos;t load your order details.</p>
          <Link href="/shop" className="btn-primary-full inline-block">Browse Shop</Link>
        </div>
      </div>
    );
  }

  const shipping = order.total >= 2999 ? 0 : 199;
  const subtotal = order.total - shipping;

  return (
    <div className="min-h-screen bg-bg-primary pt-24 md:pt-28">
      <div className="max-w-[900px] mx-auto px-5 md:px-10 py-10 md:py-16">

        {/* Success banner */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading font-black text-4xl md:text-5xl mb-3">Payment Successful!</h1>
          <p className="text-text-secondary text-lg max-w-md">
            Your order has been confirmed and will be shipped within 1–2 business days.
          </p>
        </div>

        {/* Invoice card */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden mb-8">

          {/* Invoice header */}
          <div className="bg-bg-elevated border-b border-border px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Invoice</p>
              <p className="font-mono font-bold text-accent text-base">{order.id}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-text-secondary text-sm">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-medium capitalize">{order.status}</span>
              </span>
            </div>
          </div>

          {/* Customer + Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            <div className="bg-bg-card px-6 md:px-8 py-5 space-y-1">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Billed To</p>
              <p className="font-semibold text-white">{order.customer?.name}</p>
              <p className="text-text-secondary text-sm">{order.customer?.email}</p>
              <p className="text-text-secondary text-sm">{order.customer?.phone}</p>
              <p className="text-text-secondary text-sm">
                {order.customer?.address}, {order.customer?.city}, {order.customer?.state} – {order.customer?.pincode}
              </p>
            </div>
            <div className="bg-bg-card px-6 md:px-8 py-5 space-y-1">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Payment Details</p>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Method</span>
                <span className="text-white font-medium">
                  {order.paymentMethod === "razorpay" ? "Online (Razorpay)" : "Cash on Delivery"}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Payment ID</span>
                  <span className="font-mono text-white text-xs">{order.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Est. Delivery</span>
                <span className="text-white font-medium">3–5 Business Days</span>
              </div>
            </div>
          </div>

          {/* Items list */}
          <div className="px-6 md:px-8 py-5">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-4">Items Ordered</p>
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-text-muted text-xs uppercase tracking-widest pb-3 border-b border-border">
              <span>Product</span>
              <span className="text-center">Size</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="space-y-3 mt-3">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-3 md:gap-4 items-center py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-bg-elevated border border-border">
                      <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm">{item.name}</p>
                      <p className="text-text-muted text-xs">{item.category}</p>
                      <p className="text-text-secondary text-xs">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm md:text-center">
                    <span className="md:hidden text-text-muted">Size: </span>UK {item.size}
                  </p>
                  <p className="text-text-secondary text-sm md:text-center">
                    <span className="md:hidden text-text-muted">Qty: </span>{item.quantity}
                  </p>
                  <p className="font-heading font-bold text-accent text-sm md:text-right">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-bg-elevated border-t border-border px-6 md:px-8 py-5">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-heading font-bold text-base">Total Paid</span>
                <span className="font-heading font-black text-xl text-accent">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest prompt — only show if not logged in */}
        {!user && (
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center space-y-3 mb-6">
            <p className="text-white font-semibold text-sm">Track this order anytime</p>
            <p className="text-text-secondary text-xs">
              Create a free account with the same email to see all your orders in one place.
            </p>
            <Link
              href="/signup?redirect=/account"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating PDF…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Invoice (PDF)
              </>
            )}
          </button>
          <Link href="/shop" className="btn-secondary-full">Continue Shopping</Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-muted text-sm uppercase tracking-widest animate-pulse">Loading…</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
