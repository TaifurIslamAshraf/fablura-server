"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductReviewSchema = exports.CreateProductReviewSchema = exports.ProductFilterSchema = exports.ProductSchema = void 0;
const zod_1 = require("zod");
exports.ProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Product name is required" }),
        price: zod_1.z.string({ required_error: "Product price is required" }),
        discountPrice: zod_1.z.string().optional(),
        description: zod_1.z.string({ required_error: "Product description is required" }),
        colors: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string({ required_error: "Color name is required" }),
            stock: zod_1.z.boolean({ required_error: "Color stock is required" })
        })),
        size: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string({ required_error: "Size name is required" }),
            available: zod_1.z.boolean({ required_error: "Size stock is required" })
        })),
        stock: zod_1.z.string({ required_error: "Product stock is required" }),
        sold: zod_1.z.string().optional(),
        soldAt: zod_1.z.date().optional(),
        shipping: zod_1.z.string({ required_error: "Product shipping is required" }),
        subcategory: zod_1.z.string({ required_error: "subcategory required" }),
        category: zod_1.z.string({ required_error: "product category is required" }),
    }),
});
exports.ProductFilterSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        subCategory: zod_1.z.string().optional(),
        price: zod_1.z.string().optional(),
        maxPrice: zod_1.z.string().optional(),
        minPrice: zod_1.z.string().optional(),
        ratings: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
    }),
});
exports.CreateProductReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number({ required_error: "Review rating is required" }),
        comment: zod_1.z.string({ required_error: "Review comment is required" }),
    }),
});
exports.UpdateProductReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        approved: zod_1.z.boolean({ required_error: "Review status is required" }),
        productId: zod_1.z.string({ required_error: "ProductId is required" }),
        reviewId: zod_1.z.string({ required_error: "ReviewId is required" }),
    }),
});
//# sourceMappingURL=product.schema.js.map