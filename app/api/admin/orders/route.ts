import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({
    id: String, items: Array, total: Number, customer: Object,
    paymentMethod: String, paymentId: String,
    status: { type: String, default: "confirmed" },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Order", schema);
}

export async function GET() {
  try {
    await connectDB();
    const Order = getOrderModel();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
