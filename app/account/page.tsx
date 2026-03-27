"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";

function formatPrice(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    delivered: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${styles[status] ?? "bg-white/5 text-white/50 border-white/10"}`}>
      {status}
    </span>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, fetchUser } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders/user")
        .then((r) => r.json())
        .then((d) => {
          setOrders(d.orders ?? []);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-muted text-sm animate-pulse uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-primary pt-20 md:pt-28">
      <div className="max-w-[1000px] mx-auto px-4 md:px-10 py-8 md:py-16 space-y-8 md:space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading font-black text-3xl md:text-5xl line-accent">My Account</h1>
            <p className="text-text-secondary mt-3 md:mt-4 text-sm md:text-base">
              Welcome back, <span className="text-white font-medium">{user.name}</span>
            </p>
            <p className="text-text-muted text-xs md:text-sm truncate max-w-[220px] md:max-w-none">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 text-xs md:text-sm font-semibold uppercase tracking-widest border border-white/20 hover:border-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg transition-all hover:bg-white hover:text-black touch-manipulation"
          >
            Sign Out
          </button>
        </div>

        {/* Order History */}
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl mb-4 md:mb-6">Order History</h2>

          {ordersLoading ? (
            <div className="bg-bg-card border border-border rounded-2xl p-8 md:p-10 text-center text-text-muted text-sm animate-pulse">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-bg-card border border-border rounded-2xl p-8 md:p-10 text-center space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-bg-elevated border border-border flex items-center justify-center mx-auto text-text-muted">
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-heading font-bold text-lg md:text-xl">No orders yet</p>
              <p className="text-text-secondary text-sm">Your order history will appear here.</p>
              <Link href="/shop" className="btn-primary-full inline-flex mt-2">Browse Shop</Link>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {orders.map((order: any) => (
                <div key={order._id} className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-border-light transition-colors">

                  {/* Order header */}
                  <div className="px-4 md:px-6 py-4 border-b border-border space-y-3">
                    {/* Top row: ID + status + view link */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-text-muted text-[10px] md:text-xs uppercase tracking-widest">Order ID</p>
                        <p className="font-mono font-bold text-accent text-xs md:text-sm mt-0.5 truncate max-w-[140px] md:max-w-none">
                          {order.id ?? "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={order.status} />
                        <Link
                          href={`/order-success?orderId=${order.id}`}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors whitespace-nowrap touch-manipulation"
                        >
                          View →
                        </Link>
                      </div>
                    </div>

                    {/* Bottom row: date + total */}
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="text-text-muted text-[10px] md:text-xs uppercase tracking-widest">Date</p>
                        <p className="text-white text-xs md:text-sm mt-0.5">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-[10px] md:text-xs uppercase tracking-widest">Total</p>
                        <p className="text-white font-bold text-xs md:text-sm mt-0.5">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex flex-wrap gap-2">
                      {(order.items ?? []).map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 md:gap-2 bg-bg-elevated border border-border rounded-xl px-2.5 md:px-3 py-1.5 md:py-2">
                          <span className="text-white text-xs md:text-sm font-medium line-clamp-1 max-w-[100px] md:max-w-none">{item.name}</span>
                          <span className="text-text-muted text-xs shrink-0">UK {item.size}</span>
                          <span className="text-text-muted text-xs shrink-0">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}