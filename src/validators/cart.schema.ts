import z from "zod"

export const addToCartSchema = z.object({
    body: z.object({
      productId: z.string({ required_error: "Product ID is required" }),
      colors: z.string({ required_error: "Product Color is required" }),
      size: z.string({ required_error: "Product Size is required" }),
    }),
  });