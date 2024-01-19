"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStockSold = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const updateProductStockSold = async (productId, quentity) => {
    console.log(productId, quentity);
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
//# sourceMappingURL=order.services.js.map