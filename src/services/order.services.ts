import ProductModel from "../models/product.model";
import UserModel from "../models/user.model";

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
  product.soldAt = new Date();
  await product.save({ validateBeforeSave: true });
};

export const updateReviewInfo = async (productId: string, userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isReviewdBefore = user?.reviewsInfo?.find(
    (value) => value.productId === productId
  );
  if (isReviewdBefore && isReviewdBefore.reviewsCounter) {
    isReviewdBefore.reviewsCounter =
      (isReviewdBefore.reviewsCounter as number) + 1;
  } else {
    user.reviewsInfo?.push({
      reviewsCounter: 1,
      productId: productId,
    });
  }

  await user.save();
};
