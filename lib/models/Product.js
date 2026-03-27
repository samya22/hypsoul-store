import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // kept for backward compatibility
  images: { type: [String], default: [] }, // new: multiple images
  description: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  sizes: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;