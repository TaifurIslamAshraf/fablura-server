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
    // reviewsInfo: z.object({
    //   reviewsCounter: z.number().optional(),
    //   productId: z.string().optional(),
    // }),
    role: z.enum(["admin", "user"]).optional(),
  }),
});

export const activateUserSchema = z.object({
  body: z.object({
    token: z.string({
      required_error: "Activation token is required",
    }),
    activation_code: z
      .string({
        required_error: "Activation code is required",
      })
      .length(4, "Enter Only 4 degits number"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is Required",
      })
      .email("Enter a valid email"),

    password: z
      .string({ required_error: "Password is Required" })
      .min(6, "Password should be at least 6 characters"),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ required_error: "Old Password is Required" })
      .min(6, "Password should be at least 6 characters"),

    newPassword: z
      .string({ required_error: "New Password is Required" })
      .min(6, "Password should be at least 6 characters"),
  }),
});
export const resetPasswordSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "userId is Required" }),
    token: z.string({ required_error: "token is Required" }),

    newPassword: z
      .string({ required_error: "New Password is Required" })
      .min(6, "Password should be at least 6 characters"),
  }),
});
export const socialAuthSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: "Full Name is Required",
    }),
    email: z
      .string({
        required_error: "Email is Required",
      })
      .email("Enter a valid email"),

    avatar: z.string({
      required_error: "Avatar is required",
    }),
  }),
});
export const updateUserRoleSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "userId is Required" }),
    role: z.enum(["admin", "user"]),
  }),
});
