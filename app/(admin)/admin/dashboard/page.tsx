"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: any[];
}

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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#555] text-sm animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: "📦",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Revenue",
      value: formatPrice(data?.totalRevenue ?? 0),
      icon: "💰",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: "👟",
      color: "text-[#ff3c00]",
      bg: "bg-[#ff3c00]/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#161616] border border-[#252525] rounded-2xl p-6 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center text-2xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[#555] text-xs uppercase tracking-widest">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#252525] flex items-center justify-between">
          <h2 className="text-white font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[#ff3c00] text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                {["Order ID", "Customer", "Amount", "Payment", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[#555] text-xs uppercase tracking-widest font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {(data?.recentOrders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#555] text-sm">
                    No orders yet
                  </td>
                </tr>
              ) : (
                (data?.recentOrders ?? []).map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm text-[#ff3c00] hover:underline">
                        {order.id ?? "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{order.customer?.name ?? "—"}</td>
                    <td className="px-6 py-4 text-white text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-[#888] text-sm capitalize">{order.paymentMethod ?? "—"}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-[#555] text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
