"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        address: zod_1.z.string({ required_error: "Address is required" }),
        fullName: zod_1.z.string({ required_error: "Full name is required" }),
        phone: zod_1.z
            .string({ required_error: "phone number is required" })
            .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid phone number"),
        orderNots: zod_1.z.string().optional(),
        paymentType: zod_1.z.string({ required_error: "payment type is required" }),
        itemsPrice: zod_1.z.number({ required_error: "items price is required" }),
        shippingPrice: zod_1.z.number({ required_error: "shipping price is required" }),
        orderItems: zod_1.z.array(zod_1.z.object({
            productName: zod_1.z.string({ required_error: "product name  is required" }),
            price: zod_1.z.number({ required_error: "price is required" }),
            quantity: zod_1.z.number({ required_error: "quantity is required" }),
            image: zod_1.z.string({ required_error: "image is required" }),
            product: zod_1.z.string({ required_error: "product is required" }),
        })),
        totalAmount: zod_1.z.number({ required_error: "total amount is required" }),
        user: zod_1.z
            .string()
            .optional(),
    }),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.enum([
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ]),
    }),
    params: zod_1.z.object({
        id: zod_1.z
            .string({ required_error: "params id is required" })
            .refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), "Invalid order id"),
    }),
});
exports.deleteOrderSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({ required_error: "Order id is required" })
            .refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), "Invalid order id"),
    }),
});
//# sourceMappingURL=order.schema.js.map