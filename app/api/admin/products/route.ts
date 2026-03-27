import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getProductModel() {
  if (mongoose.models.Product) return mongoose.models.Product;
  const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String, category: String, price: Number,
    image: String,
    images: { type: [String], default: [] },
    description: String,
    isNew: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Product", schema);
}

export async function GET() {
  try {
    await connectDB();
    const Product = getProductModel();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const Product = getProductModel();

    const images = body.images ?? [];
    const image = images[0] ?? body.image ?? "";

    const id = "snk-" + Date.now();
    const product = await Product.create({
      ...body,
      id,
      image,
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}