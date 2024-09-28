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
exports.orderSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.orderSchema = new mongoose_1.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Shipping address is required"],
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
    },
    orderItems: [
        {
            productName: {
                type: String,
                required: [true, "Product name is required"],
            },
            colors: {
                type: String,
                required: [true, "Product colors are required"],
            },
            size: {
                type: String,
                required: [true, "Product size are required"],
            },
            price: {
                type: Number,
                required: [true, "Product price is required"],
            },
            quantity: {
                type: Number,
                required: [true, "Product quentity is required"],
            },
            image: {
                type: String,
                required: [true, "Product image is required"],
            },
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"],
            },
        },
    ],
    orderNots: {
        type: String,
    },
    user: {
        type: String,
        ref: "User",
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    orderId: {
        type: String,
        required: [true, "OrderId is required"],
    },
    paymentType: {
        type: String,
        required: [true, "Payment Type is required"],
    },
    itemsPrice: {
        type: Number,
        required: [true, "Items price is required"],
    },
    shippingPrice: {
        type: Number,
        required: [true, "Shipping price is required"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
const OrderModel = (0, mongoose_1.model)("Order", exports.orderSchema);
exports.default = OrderModel;
//# sourceMappingURL=order.mode.js.map