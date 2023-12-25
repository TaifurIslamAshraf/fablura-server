import * as z from "zod";

export const userSchemaValidator = z.object({
  body: z.object({
    fullName: z.string({
      required_error: "Full Name is Required",
    }),
    email: z
      .string({
        required_error: "Email is Required",
      })
      .email("Enter a valid email"),
    password: z
      .string({
        required_error: "Password is Required",
      })
      .min(6, "Password should be at least 6 characters"),

    isSocialAuth: z.boolean().optional(),
    avatar: z.string().optional(),
    address: z.string({
      required_error: "Address is required",
    }),
    phone: z.string({
      required_error: "Phone number is required",
    }),
    role: z.enum(["admin", "user"]).optional(),
  }),
});
