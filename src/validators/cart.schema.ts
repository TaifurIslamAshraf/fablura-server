import z from "zod"
import { Types } from "mongoose";

const objectIdSchema = z.string().refine((val)=> Types.ObjectId.isValid(val), { message: 'Invalid ObjectId',})


export const addToCartSchema = z.object({
    body: z.object({
      productId: objectIdSchema.describe( "Product ID is require"),
      colors: z.string({required_error: "Product Color is required"}),
      size: z.string({ required_error:"Product Size is required"} ),
    }),
  });