
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getOrderModel() {
  if (mongoose.models.Order) return mongoose.models.Order;
  const schema = new mongoose.Schema({
    id: String, items: Array, total: Number, customer: Object,
    paymentMethod: String, paymentId: String, status: { type: String, default: "confirmed" },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Order", schema);
}

function getProductModel() {
  if (mongoose.models.Product) return mongoose.models.Product;
  const schema = new mongoose.Schema({
    id: String, name: String, category: String, price: Number,
    image: String, description: String, isNew: Boolean, featured: Boolean,
    sizes: [String], stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("Product", schema);
}

export async function GET() {
  try {
    await connectDB();
    const Order = getOrderModel();
    const Product = getProductModel();

    const [orders, products] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).lean(),
      Product.find().lean(),
    ]);

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const recentOrders = orders.slice(0, 8);

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.length,
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
