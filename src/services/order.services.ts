import ProductModel from "../models/product.model";

export const updateProductStockSold = async (
  productId: string,
  quentity: number
) => {
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  product.stock -= quentity;
  product.sold += quentity;
  await product.save({ validateBeforeSave: true });
};
