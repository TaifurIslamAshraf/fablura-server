"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductReviewSchema = exports.CreateProductReviewSchema = exports.ProductFilterSchema = exports.ProductSchema = exports.FoodsDescriptionSchema = exports.ElectronicsDescriptionSchema = void 0;
const zod_1 = require("zod");
exports.ElectronicsDescriptionSchema = zod_1.z.object({
    body: zod_1.z.object({
        colors: zod_1.z.string({ required_error: "Color is required" }),
        brand: zod_1.z.string({ required_error: "Brand is required" }),
        warrantyPeriod: zod_1.z.string().optional(),
        countryOrigin: zod_1.z.string().optional(),
        batteryCapacity: zod_1.z.string().optional(),
        features: zod_1.z.string().optional(),
        dimensions: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        waterproof: zod_1.z.string().optional(),
        powerSupply: zod_1.z.string().optional(),
        bodyMaterials: zod_1.z.string().optional(),
        chargingTime: zod_1.z.string().optional(),
    }),
});
exports.FoodsDescriptionSchema = zod_1.z.object({
    body: zod_1.z.object({
        ingredients: zod_1.z.string({
            required_error: "Product Ingredients is required",
        }),
        foodDesc: zod_1.z.string({ required_error: "Product description is required" }),
    }),
});
exports.ProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Product name is required" }),
        descriptionType: zod_1.z.enum(["electronics", "foods"], {
            required_error: "Product descriptionType is required",
        }),
        price: zod_1.z.string({ required_error: "Product price is required" }),
        discountPrice: zod_1.z.string().optional(),
        stock: zod_1.z.string({ required_error: "Product stock is required" }),
        sold: zod_1.z.string().optional(),
        soldAt: zod_1.z.date().optional(),
        shipping: zod_1.z.string({ required_error: "Product shipping is required" }),
        subcategory: zod_1.z.string({ required_error: "subcategory required" }),
        category: zod_1.z.string({ required_error: "product category is required" }),
        // description: z
        //   .union([ElectronicsDescriptionSchema, FoodsDescriptionSchema])
        //   .optional(),
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