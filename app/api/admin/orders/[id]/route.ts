import { NextResponse } from "next/server";
import { generateOrderId } from "@/lib/utils";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({
    id: { type: String },
    items: { type: Array, default: [] },
    total: { type: Number },
    customer: { type: Object },
    paymentMethod: { type: String, default: "cod" },
    paymentId: { type: String, default: null },
    status: { type: String, default: "confirmed" },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Order", schema);
}

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer, paymentMethod, paymentId } = body;

    if (!items || !total || !customer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const Order = getOrderModel();
    const Product = getProductModel();

    const orderId = generateOrderId();

    await Order.create({
      id: orderId,
      items,
      total,
      customer,
      paymentMethod: paymentMethod || "cod",
      paymentId: paymentId || null,
      status: "confirmed",
      createdAt: new Date(),
    });

    // Auto-reduce stock for each item ordered
    for (const item of items) {
      await Product.findOneAndUpdate(
        { id: item.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity }, updatedAt: new Date() }
      );
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error?.message);
    return NextResponse.json({ error: error?.message, orderId: null }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const Order = getOrderModel();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
