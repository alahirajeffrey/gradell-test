export type ProductType = {
  name: string;
  price: number;
  description: string;
  quantity: number;
};

export type UpdateProductQuantityType = {
  productId: string;
  quantityAfterPurchase: number;
};
