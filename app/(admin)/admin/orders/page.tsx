"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  _id: string;
  id: string;
  customer: { name: string; email: string };
  total: number;
  paymentMethod: string;
  paymentId: string;
  status: string;
  createdAt: string;
  items: any[];
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const statuses = ["all", "confirmed", "pending", "shipped", "delivered"];

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              filter === s
                ? "bg-[#ff3c00] text-white"
                : "bg-[#161616] border border-[#252525] text-[#888] hover:text-white hover:border-white/20"
            }`}
          >
            {s === "all" ? `All (${orders.length})` : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]">
                {["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[#555] text-xs uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-[#555] text-sm animate-pulse">Loading orders...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-[#555] text-sm">No orders found.</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-[#ff3c00] hover:underline">
                        {order.id ?? "—"}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white text-sm">{order.customer?.name ?? "—"}</p>
                      <p className="text-[#555] text-xs">{order.customer?.email ?? ""}</p>
                    </td>
                    <td className="px-5 py-4 text-[#888] text-sm">{order.items?.length ?? 0} item(s)</td>
                    <td className="px-5 py-4 text-white text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4 text-[#888] text-sm capitalize">{order.paymentMethod ?? "—"}</td>
                    <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-4 text-[#555] text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors whitespace-nowrap"
                      >
                        View →
                      </Link>
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
