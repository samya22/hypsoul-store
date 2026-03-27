"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-XXXX";

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-5 py-24">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="mb-8">
          <h1 className="font-heading font-black text-4xl md:text-5xl mb-3">Order Confirmed!</h1>
          <p className="text-text-secondary text-lg">
            You&apos;re dropping in style. Your order is confirmed and will be on its way soon.
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Order ID</span>
            <span className="font-mono font-medium text-sm text-accent">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Status</span>
            <span className="flex items-center gap-1.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-medium">Confirmed</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Est. Delivery</span>
            <span className="text-sm font-medium">3–5 Business Days</span>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-8">
          A confirmation email has been sent to your inbox. Track your order using the ID above.
        </p>

        {/* Guest prompt */}
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center space-y-3">
          <p className="text-white font-semibold text-sm">Want to track this order?</p>
          <p className="text-text-secondary text-xs">Create an account with the same email you used to see all your orders.</p>
          <Link href="/signup?redirect=/account" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Create Free Account
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="btn-primary-full">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-secondary-full">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
