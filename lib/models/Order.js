import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    category: String,
    price: Number,
    image: String,
    size: String,
    quantity: Number,
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
    state: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  total: { type: Number, required: true },
  customer: customerSchema,
  paymentMethod: { type: String, default: "cod" },
  paymentId: { type: String, default: null },
  status: { type: String, default: "confirmed" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
