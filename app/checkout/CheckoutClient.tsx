"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { CustomerInfo } from "@/types";
import { useAuthStore } from "@/lib/auth-store";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
}

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

type Step = "shipping" | "payment";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "Maharashtra",
  });

  const { user } = useAuthStore();
  const total = getTotalPrice();
  const shipping = total >= 2999 ? 0 : 199;
  const grandTotal = total + shipping;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name,
        email: f.email || user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/shop");
    }
  }, [items, mounted, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = async (method: "razorpay" | "cod") => {
    setLoading(true);
    setError("");

    if (method === "cod") {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            total: grandTotal,
            customer: form,
            paymentMethod: "cod",
          }),
        });
        const data = await res.json();
        if (data.orderId) {
          clearCart();
          router.push(`/order-confirmation?orderId=${data.orderId}`);
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await fetch("/api/orders/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const data = await res.json();

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Hypsoul",
        description: "Premium Sneakers",
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#ff3c00" },
        handler: (response) => {
          const saveOrderAndRedirect = async () => {
            try {
              const orderRes = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items,
                  total: grandTotal,
                  customer: form,
                  paymentMethod: "razorpay",
                  paymentId: response.razorpay_payment_id,
                }),
              });
              const orderData = await orderRes.json();
              clearCart();
              if (orderData.orderId) {
                window.location.href = `/order-success?orderId=${orderData.orderId}`;
              } else {
                window.location.href = `/order-success?orderId=${response.razorpay_payment_id}`;
              }
            } catch (err) {
              console.error("Order save error after payment:", err);
              clearCart();
              window.location.href = `/order-success?orderId=${response.razorpay_payment_id}`;
            }
          };
          saveOrderAndRedirect();
        },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 md:pt-28 flex items-center justify-center">
        <div className="text-text-muted text-sm uppercase tracking-widest animate-pulse">Loading checkout…</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 md:pt-28 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="font-heading font-bold text-2xl">Your cart is empty</p>
          <p className="text-text-secondary">Redirecting you to the shop…</p>
          <Link href="/shop" className="btn-primary-full inline-block mt-2">Browse Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-20 md:pt-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6 md:py-16">

        {/* Page heading */}
        <div className="mb-6 md:mb-10">
          <h1 className="font-heading font-black text-3xl md:text-5xl line-accent">Checkout</h1>
          <p className="text-text-secondary mt-3 md:mt-4 text-sm md:text-base">
            {step === "shipping" ? "Enter your shipping details" : "Choose a payment method"}
          </p>
          {!user && (
            <p className="text-text-muted text-xs md:text-sm mt-2">
              Already have an account?{" "}
              <a href="/login?redirect=/checkout" className="text-accent hover:underline">Sign in</a>{" "}
              to auto-fill your details.
            </p>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <div className={`flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-widest ${step === "shipping" ? "text-accent" : "text-text-muted"}`}>
            <span className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === "shipping" ? "border-accent bg-accent text-white" : "border-text-muted text-text-muted"}`}>1</span>
            Shipping
          </div>
          <div className="flex-1 h-px bg-border max-w-[40px] md:max-w-[60px]" />
          <div className={`flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-widest ${step === "payment" ? "text-accent" : "text-text-muted"}`}>
            <span className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === "payment" ? "border-accent bg-accent text-white" : "border-text-muted text-text-muted"}`}>2</span>
            Payment
          </div>
        </div>

        {/* Order summary on mobile — shown ABOVE the form */}
        <div className="lg:hidden mb-6">
          <details className="bg-bg-card border border-border rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between px-4 py-4 cursor-pointer font-heading font-bold text-sm uppercase tracking-widest touch-manipulation">
              <span>Order Summary</span>
              <span className="text-accent font-black">{formatPrice(grandTotal)}</span>
            </summary>
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                  <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-bg-elevated border border-border">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-xs line-clamp-1">{item.name}</p>
                    <p className="text-text-muted text-xs">UK {item.size} · Qty {item.quantity}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-border space-y-1.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span><span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold">
                  <span>Total</span>
                  <span className="text-accent">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </details>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-2">

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1 — SHIPPING */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="bg-bg-card border border-border rounded-2xl p-4 md:p-8 space-y-4 md:space-y-5">
                <h2 className="font-heading font-bold text-lg md:text-xl mb-1 md:mb-2">Shipping Information</h2>

                <div className="space-y-1.5">
                  <label className="text-text-secondary text-xs uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-base"
                  />
                </div>

                {/* Email + Phone — stack on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary text-xs uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary text-xs uppercase tracking-widest">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 7709138858"
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-base"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary text-xs uppercase tracking-widest">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Flat / House No, Street, Area"
                    className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-base"
                  />
                </div>

                {/* City + Pincode + State — stack on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary text-xs uppercase tracking-widest">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="Mumbai"
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary text-xs uppercase tracking-widest">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      placeholder="400001"
                      pattern="[0-9]{6}"
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary text-xs uppercase tracking-widest">State</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none transition-colors appearance-none text-base"
                    >
                      {INDIA_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary-full w-full mt-2 touch-manipulation">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* STEP 2 — PAYMENT */}
            {step === "payment" && (
              <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-8 space-y-5 md:space-y-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep("shipping")}
                    className="p-2 text-text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5 touch-manipulation"
                    aria-label="Back to shipping"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="font-heading font-bold text-lg md:text-xl">Payment Method</h2>
                </div>

                {/* Shipping address recap */}
                <div className="bg-bg-elevated border border-border rounded-xl p-3 md:p-4 text-sm text-text-secondary space-y-1">
                  <p className="text-white font-semibold">{form.name}</p>
                  <p className="text-xs md:text-sm">{form.address}, {form.city}, {form.state} – {form.pincode}</p>
                  <p className="text-xs md:text-sm">{form.email} · {form.phone}</p>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {/* Razorpay */}
                  <button
                    onClick={() => handlePayment("razorpay")}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 md:p-5 bg-bg-elevated border border-border hover:border-accent rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0">
                        💳
                      </div>
                      <div className="text-left">
                        <p className="font-heading font-bold text-sm md:text-base group-hover:text-accent transition-colors">Pay Online</p>
                        <p className="text-text-secondary text-xs md:text-sm">UPI, Cards, Net Banking via Razorpay</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-text-muted group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* COD */}
                  <button
                    onClick={() => handlePayment("cod")}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 md:p-5 bg-bg-elevated border border-border hover:border-accent rounded-2xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0">
                        💵
                      </div>
                      <div className="text-left">
                        <p className="font-heading font-bold text-sm md:text-base group-hover:text-accent transition-colors">Cash on Delivery</p>
                        <p className="text-text-secondary text-xs md:text-sm">Pay when your order arrives</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-text-muted group-hover:text-accent transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-3 py-4 text-text-secondary text-sm">
                    <svg className="w-4 h-4 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing your order…
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Order Summary (desktop only) ── */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
              <h2 className="font-heading font-bold text-xl">Order Summary</h2>

              <div className="space-y-4 pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-bg-elevated border border-border">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-text-muted text-xs">UK {item.size} · Qty {item.quantity}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-accent">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
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
                <span className="font-heading font-bold text-lg">Total</span>
                <span className="font-heading font-black text-2xl text-accent">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-text-muted text-xs">
                <span className="flex items-center gap-1">🔒 Secure checkout</span>
                <span>·</span>
                <span className="flex items-center gap-1">✅ Authentic</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}