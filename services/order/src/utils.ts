import { Order } from "./models";
import { OrderType } from "./types";

export const createOrder = async (order: OrderType) => {
  try {
    return await Order.create({
      totalCost: order.totalCost,
      deliveryAddress: order.deliveryAddress,
      products: order.products,
    });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getSingleOrder = async (orderId: string) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("order does not exist");

    return order;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
