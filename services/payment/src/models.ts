import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
