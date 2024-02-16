import mongoose from "mongoose";
import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    address: z.string({ required_error: "Address is required" }),
    fullName: z.string({ required_error: "Full name is required" }),
    phone: z
      .string({ required_error: "phone number is required" })
      .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid phone number"),

    orderNots: z.string().optional(),
    paymentType: z.string({ required_error: "payment type is required" }),
    itemsPrice: z.number({ required_error: "items price is required" }),
    shippingPrice: z.number({ required_error: "shipping price is required" }),
    orderItems: z.array(
      z.object({
        productName: z.string({ required_error: "product name  is required" }),
        price: z.number({ required_error: "price is required" }),
        quantity: z.number({ required_error: "quantity is required" }),
        image: z.string({ required_error: "image is required" }),
        product: z.string({ required_error: "product is required" }),
      })
    ),
    totalAmount: z.number({ required_error: "total amount is required" }),
    user: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum([
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ]),
  }),
  params: z.object({
    id: z
      .string({ required_error: "params id is required" })
      .refine(
        (value) => mongoose.Types.ObjectId.isValid(value),
        "Invalid order id"
      ),
  }),
});

export const deleteOrderSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Order id is required" })
      .refine(
        (value) => mongoose.Types.ObjectId.isValid(value),
        "Invalid order id"
      ),
  }),
});
