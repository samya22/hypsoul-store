"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { InvoiceData } from "@/lib/invoice";

function formatPrice(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

const STATUSES = ["pending", "confirmed", "shipped", "delivered"];

const statusStyles: Record<string, string> = {
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delivered: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdatingStatus(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
      setMsg("Status updated!");
      setTimeout(() => setMsg(""), 3000);
    }
    setUpdatingStatus(false);
  };

  const handleDownload = useCallback(async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const { generateInvoicePDF } = await import("@/lib/invoice");
      const invoiceData: InvoiceData = {
        orderId: order.id,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        paymentId: order.paymentId ?? null,
        customer: order.customer,
        items: order.items,
        total: order.total,
      };
      generateInvoicePDF(invoiceData);
    } finally {
      setDownloading(false);
    }
  }, [order]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#555] text-sm animate-pulse">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-[#555]">Order not found.</p>
        <Link href="/admin/orders" className="text-[#ff3c00] text-sm mt-2 inline-block hover:underline">← Back to orders</Link>
      </div>
    );
  }

  const shipping = order.total >= 2999 ? 0 : 199;
  const subtotal = order.total - shipping;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/orders" className="flex items-center gap-2 text-[#888] hover:text-white text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-[#ff3c00] hover:bg-[#ff5722] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? "Generating..." : "Download Invoice"}
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{msg}</div>
      )}

      {/* Order header */}
      <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[#555] text-xs uppercase tracking-widest">Order ID</p>
          <p className="font-mono text-[#ff3c00] font-bold text-lg mt-1">{order.id ?? orderId}</p>
          <p className="text-[#555] text-xs mt-1">
            {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "—"}
          </p>
        </div>
        {/* Status update */}
        <div className="flex flex-col gap-2">
          <p className="text-[#555] text-xs uppercase tracking-widest">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusUpdate(s)}
                disabled={updatingStatus || order.status === s}
                className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors disabled:cursor-not-allowed ${
                  order.status === s
                    ? statusStyles[s] ?? "bg-white/5 text-white border-white/10"
                    : "bg-transparent border-[#252525] text-[#555] hover:text-white hover:border-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 space-y-3">
          <h3 className="text-[#555] text-xs uppercase tracking-widest">Customer</h3>
          <p className="text-white font-semibold">{order.customer?.name}</p>
          <p className="text-[#888] text-sm">{order.customer?.email}</p>
          <p className="text-[#888] text-sm">{order.customer?.phone}</p>
          <p className="text-[#888] text-sm">
            {order.customer?.address}, {order.customer?.city}, {order.customer?.state} – {order.customer?.pincode}
          </p>
        </div>

        {/* Payment info */}
        <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 space-y-3">
          <h3 className="text-[#555] text-xs uppercase tracking-widest">Payment</h3>
          <div className="flex justify-between text-sm">
            <span className="text-[#888]">Method</span>
            <span className="text-white capitalize">{order.paymentMethod ?? "—"}</span>
          </div>
          {order.paymentId && (
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">Payment ID</span>
              <span className="font-mono text-xs text-white">{order.paymentId}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[#888]">Subtotal</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#888]">Shipping</span>
            <span className={shipping === 0 ? "text-green-400" : "text-white"}>
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#252525]">
            <span className="text-white font-bold">Total</span>
            <span className="text-[#ff3c00] font-black text-lg">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#252525]">
          <h3 className="text-white font-bold">Items ({order.items?.length ?? 0})</h3>
        </div>
        <div className="divide-y divide-[#1e1e1e]">
          {(order.items ?? []).map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1c1c1c] border border-[#252525] shrink-0">
                <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{item.name}</p>
                <p className="text-[#555] text-xs">UK {item.size} · Qty {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-[#ff3c00] font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-[#555] text-xs">{formatPrice(item.price)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
