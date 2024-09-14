import { Payment } from "./models";
import { PaymentType } from "./types";

export const makePayment = async (payment: PaymentType) => {
  try {
    return await Payment.create({
      orderId: payment.orderId,
      amount: payment.amount,
    });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
