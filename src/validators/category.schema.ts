import * as z from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "category name is Required" }),
  }),
});
export const getSingleCategorySchema = z.object({
  params: z.object({
    slug: z.string({ required_error: "category id is Required" }),
  }),
});
export const updateCategorySchema = z.object({
  body: z.object({
    id: z.string({ required_error: "category id is Required" }),
    name: z.string({ required_error: "category name is Required" }),
  }),
});

// sub category schema
export const createSubCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "category name is Required" }),
    category: z.string({ required_error: "category is Required" }),
  }),
});
