"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.socialAuthSchema = exports.resetPasswordSchema = exports.updatePasswordSchema = exports.loginUserSchema = exports.activateUserSchema = exports.userSchemaValidator = void 0;
const z = __importStar(require("zod"));
exports.userSchemaValidator = z.object({
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
exports.activateUserSchema = z.object({
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
exports.loginUserSchema = z.object({
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
exports.updatePasswordSchema = z.object({
    body: z.object({
        oldPassword: z
            .string({ required_error: "Old Password is Required" })
            .min(6, "Password should be at least 6 characters"),
        newPassword: z
            .string({ required_error: "New Password is Required" })
            .min(6, "Password should be at least 6 characters"),
    }),
});
exports.resetPasswordSchema = z.object({
    body: z.object({
        userId: z.string({ required_error: "userId is Required" }),
        token: z.string({ required_error: "token is Required" }),
        newPassword: z
            .string({ required_error: "New Password is Required" })
            .min(6, "Password should be at least 6 characters"),
    }),
});
exports.socialAuthSchema = z.object({
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
exports.updateUserRoleSchema = z.object({
    body: z.object({
        userId: z.string({ required_error: "userId is Required" }),
        role: z.enum(["admin", "user"]),
    }),
});
//# sourceMappingURL=user.schema.js.map