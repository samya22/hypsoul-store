import { NextResponse } from "next/server";
import { products as staticProducts } from "@/lib/products";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getProductModel() {
  if (mongoose.models.Product) return mongoose.models.Product;
  const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String, category: String, price: Number,
    image: String, description: String,
    isNew: Boolean, featured: Boolean,
    sizes: [String], stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Product", schema);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  try {
    await connectDB();
    const Product = getProductModel();
    const dbProducts = await Product.find().lean();

    // If DB has products, use those. Otherwise fall back to static.
    let result: any[] = dbProducts.length > 0 ? dbProducts : staticProducts;

    if (category && category !== "all") {
      result = result.filter((p: any) => p.category === category);
    }
    if (q) {
      const query = q.toLowerCase();
      result = result.filter((p: any) =>
        p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ products: result });
  } catch {
    // MongoDB unavailable — serve static products
    let result: any[] = [...staticProducts];
    if (category && category !== "all") result = result.filter((p) => p.category === category);
    if (q) {
      const query = q.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }
    return NextResponse.json({ products: result });
  }
}
