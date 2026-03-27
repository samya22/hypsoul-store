"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  stock: number;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Out of Stock</span>;
  if (stock <= 5)
    return <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Low Stock</span>;
  return <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">In Stock</span>;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/inventory");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleStockChange = (id: string, val: string) => {
    setEditing((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async (id: string) => {
    const stock = editing[id];
    if (stock === undefined || stock === "") return;
    setSaving(id);
    const res = await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock: Number(stock) }),
    });
    if (res.ok) {
      setMsg("Stock updated!");
      setTimeout(() => setMsg(""), 3000);
      setEditing((prev) => { const n = { ...prev }; delete n[id]; return n; });
      fetchProducts();
    }
    setSaving(null);
  };

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const inStock = products.filter((p) => p.stock > 5).length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "In Stock", count: inStock, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { label: "Low Stock (≤5)", count: lowStock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
          { label: "Out of Stock", count: outOfStock, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-[#888] text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {msg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{msg}</div>
      )}

      {/* Inventory table */}
      <div className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#252525]">
          <h2 className="text-white font-bold">Stock Levels</h2>
          <p className="text-[#555] text-xs mt-0.5">Update stock counts directly. Changes are saved to the database.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]">
                {["Product", "Category", "Current Stock", "Status", "Update Stock"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[#555] text-xs uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[#555] text-sm animate-pulse">Loading inventory...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[#555] text-sm">No products found. Add products first.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={`hover:bg-white/[0.02] transition-colors ${p.stock === 0 ? "bg-red-500/5" : p.stock <= 5 ? "bg-yellow-500/5" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1c1c1c] border border-[#252525] shrink-0">
                          <Image src={p.image} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{p.name}</p>
                          <p className="text-[#555] text-xs">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#888] text-sm">{p.category}</td>
                    <td className="px-5 py-4">
                      <span className="text-white font-bold text-lg">{p.stock}</span>
                      <span className="text-[#555] text-xs ml-1">units</span>
                    </td>
                    <td className="px-5 py-4"><StockBadge stock={p.stock} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={editing[p.id] ?? ""}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          placeholder={String(p.stock)}
                          className="w-20 bg-[#1c1c1c] border border-[#252525] rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#ff3c00] focus:outline-none transition-colors"
                        />
                        <button
                          onClick={() => handleSave(p.id)}
                          disabled={saving === p.id || editing[p.id] === undefined}
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#ff3c00]/10 hover:bg-[#ff3c00]/20 text-[#ff3c00] border border-[#ff3c00]/20 transition-colors disabled:opacity-30"
                        >
                          {saving === p.id ? "..." : "Save"}
                        </button>
                      </div>
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
