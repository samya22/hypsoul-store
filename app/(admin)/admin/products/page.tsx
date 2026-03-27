"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  isNew: boolean;
  featured: boolean;
  sizes: string[];
  stock: number;
}

const EMPTY_FORM = {
  name: "", category: "", price: "", images: [] as string[],
  description: "", isNew: false, featured: false, sizes: "", stock: "",
};

const CATEGORIES = ["Lifestyle", "Skate", "Running", "Limited Edition", "Collector"];

function formatPrice(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({ ...EMPTY_FORM, images: [] });
    setNewImageUrl("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, category: p.category, price: String(p.price),
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      description: p.description,
      isNew: p.isNew, featured: p.featured,
      sizes: (p.sizes ?? []).join(", "), stock: String(p.stock ?? 0),
    });
    setNewImageUrl("");
    setShowModal(true);
  };

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images,
      image: form.images[0] ?? "",
    };

    const url = editProduct ? `/api/admin/products/${editProduct.id}` : "/api/admin/products";
    const method = editProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMsg(editProduct ? "Product updated!" : "Product added!");
      setShowModal(false);
      fetchProducts();
      setTimeout(() => setMsg(""), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleteId(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    setMsg("Product deleted.");
    fetchProducts();
    setTimeout(() => setMsg(""), 3000);
  };

  const stockBadge = (stock: number) => {
    if (stock === 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Out of Stock</span>;
    if (stock <= 5) return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Low Stock</span>;
    return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">In Stock</span>;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-[#888] text-sm">{products.length} products</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#ff3c00] hover:bg-[#ff5722] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{msg}</div>
      )}

      {/* Table */}
      <div className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[#555] text-xs uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#555] text-sm animate-pulse">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[#555] text-sm">No products yet.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1c1c1c] border border-[#252525] shrink-0">
                          <Image src={p.image || (p.images?.[0] ?? "")} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{p.name}</p>
                          <p className="text-[#555] text-xs">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#888] text-sm">{p.category}</td>
                    <td className="px-5 py-4 text-white text-sm font-medium">{formatPrice(p.price)}</td>
                    <td className="px-5 py-4 text-white text-sm">{p.stock ?? 0}</td>
                    <td className="px-5 py-4">{stockBadge(p.stock ?? 0)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">Edit</button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50">
                          {deleteId === p.id ? "..." : "Delete"}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] border border-[#252525] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-white font-bold text-lg">{editProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nike Air Force 1"
                  className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Images */}
              <div>
                <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">
                  Product Images <span className="text-[#555] normal-case">(first image = main)</span>
                </label>

                {/* Image previews */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden bg-[#1c1c1c] border border-[#252525]">
                        <Image src={url} alt={`img-${i}`} width={64} height={64} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <div className="absolute top-0 left-0 bg-[#ff3c00] text-white text-[9px] px-1 py-0.5 leading-none">Main</div>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add image URL input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addImageUrl()}
                    placeholder="/images/shoe.avif or https://..."
                    className="flex-1 bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none text-sm transition-colors"
                  />
                  <button
                    onClick={addImageUrl}
                    className="px-4 py-2.5 bg-[#ff3c00] hover:bg-[#ff5722] text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
                <p className="text-[#555] text-xs mt-1.5">Press Enter or click Add. Drag to reorder not supported yet.</p>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="3999"
                    className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="10"
                    className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
                  placeholder="7, 8, 9, 10, 11"
                  className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white focus:border-[#ff3c00] focus:outline-none text-sm transition-colors appearance-none"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Product description..."
                  className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none text-sm transition-colors resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                {[{ label: "New Arrival", key: "isNew" }, { label: "Featured", key: "featured" }].map((t) => (
                  <label key={t.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as any)[t.key]}
                      onChange={(e) => setForm((f) => ({ ...f, [t.key]: e.target.checked }))}
                      className="w-4 h-4 accent-[#ff3c00]"
                    />
                    <span className="text-[#888] text-sm">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-[#252525]">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-[#252525] text-[#888] hover:text-white hover:border-white/20 text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#ff3c00] hover:bg-[#ff5722] text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}