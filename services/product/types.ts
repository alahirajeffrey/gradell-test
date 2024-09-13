export type ProductType = {
  name: string;
  price: number;
  description: string;
  quantity: number;
  sellerId: string;
};

export type UpdateProductQuantityType = {
  productId: string;
  quantityAfterPurchase: number;
};
