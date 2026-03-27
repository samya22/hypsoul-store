import { Suspense } from "react";
import { products as staticProducts, categories } from "@/lib/products";
import ShopClient from "./ShopClient";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getProductModel() {
  if (mongoose.models.Product) return mongoose.models.Product;

  const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    category: String,
    price: Number,
    image: String,
    images: { type: [String], default: [] },
    description: String,
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model("Product", schema);
}

// 🔥 SERIALIZER (MAIN FIX)
function serializeProducts(products: any[]) {
  return products.map((p) => ({
    ...p,
    _id: p._id?.toString(),
    createdAt: p.createdAt?.toISOString?.(),
  }));
}

async function getAllProducts() {
  try {
    await connectDB();
    const Product = getProductModel();

    const dbProducts = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    // 🔥 FIX APPLY
    const serializedDB = serializeProducts(dbProducts);

    // Merge: DB first + static fallback
    const dbIds = new Set(serializedDB.map((p: any) => p.id));
    const filteredStatic = staticProducts.filter((p) => !dbIds.has(p.id));

    return [...serializedDB, ...filteredStatic];
  } catch {
    return staticProducts;
  }
}

export const metadata = {
  title: "Shop",
  description:
    "Browse the full Hypsoul sneaker collection. Filter by category, sort by price, find your next pair.",
};

export default async function ShopPage() {
  const allProducts = await getAllProducts();

  return (
    <>
      <div className="pt-24 md:pt-36 pb-8 md:pb-12 px-4 md:px-10 bg-bg-primary border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-accent text-xs font-bold uppercase tracking-[4px]">
            Catalog
          </span>

          <h1 className="font-heading font-black text-3xl md:text-6xl mt-2 line-accent">
            All Collection
          </h1>

          <p className="text-text-secondary mt-3 md:mt-5 text-sm md:text-base max-w-lg">
            {allProducts.length} styles available — from iconic classics to the latest drops.
          </p>
        </div>
      </div>

      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient products={allProducts} categories={categories} />
      </Suspense>
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="py-8 md:py-12 px-4 md:px-10 bg-bg-secondary min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-bg-card rounded-2xl overflow-hidden border border-border"
            >
              <div className="aspect-square shimmer" />
              <div className="p-3 md:p-5 space-y-2 md:space-y-3">
                <div className="h-3 w-16 md:w-20 shimmer rounded" />
                <div className="h-4 md:h-5 w-3/4 shimmer rounded" />
                <div className="h-5 md:h-6 w-20 md:w-24 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}