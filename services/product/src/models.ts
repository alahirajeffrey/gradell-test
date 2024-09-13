import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    sellerId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
