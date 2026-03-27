import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    await connectDB();
    const Product = getProductModel();
    const products = await Product.find().sort({ stock: 1 }).lean();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, stock } = await request.json();
    await connectDB();
    const Product = getProductModel();
    const product = await Product.findOneAndUpdate(
      { id },
      { stock: Number(stock), updatedAt: new Date() },
      { new: true }
    ).lean();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
