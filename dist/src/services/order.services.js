"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewInfo = exports.updateProductStockSold = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const updateProductStockSold = async (productId, quentity) => {
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    product.stock -= quentity;
    product.sold += quentity;
    product.soldAt = new Date();
    await product.save({ validateBeforeSave: true });
};
exports.updateProductStockSold = updateProductStockSold;
const updateReviewInfo = async (productId, userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const isReviewdBefore = user?.reviewsInfo?.find((value) => value.productId === productId);
    if (isReviewdBefore && isReviewdBefore.reviewsCounter) {
        isReviewdBefore.reviewsCounter =
            isReviewdBefore.reviewsCounter + 1;
    }
    else {
        user.reviewsInfo?.push({
            reviewsCounter: 1,
            productId: productId,
        });
    }
    await user.save();
};
exports.updateReviewInfo = updateReviewInfo;
//# sourceMappingURL=order.services.js.map