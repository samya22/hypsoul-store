import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({
    id: String, items: Array, total: Number, customer: Object,
    paymentMethod: String, paymentId: String,
    status: { type: String, default: "confirmed" },
    userId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Order", schema);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const Order = getOrderModel();
    const { id } = await params;

    let order = await Order.findOne({ id }).lean();
    if (!order) {
      order = await Order.findOne({ paymentId: id }).lean();
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Fetch order error:", error?.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
