import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    products: { type: Array, required: true },
    deliveryAddress: { type: String, required: true },
    totalCost: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
