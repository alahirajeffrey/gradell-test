import { ProductType, UpdateProductQuantityType } from "./types";
import { Product } from "./models";

export const createProduct = async (product: ProductType) => {
  try {
    return await Product.create({
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      sellerId: product.sellerId,
    });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    return await Product.find({});
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getSingleProduct = async (productId: string) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("product does not exist");

    return product;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const updateProductQuantity = async (
  data: UpdateProductQuantityType
) => {
  try {
    const product = await Product.findById(data.productId);
    if (!product) throw new Error("product does not exist");

    return await Product.findById(
      product._id,
      {
        quantity: data.quantityAfterPurchase,
      },
      { new: true }
    );
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
