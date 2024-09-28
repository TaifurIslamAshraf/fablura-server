"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
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
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    selected: {
        type: Boolean,
        default: true,
    },
});
const cartSchema = new mongoose_1.default.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    cartItem: [cartItemSchema],
    totalMainPrice: {
        type: Number,
        default: 0,
    },
    totalDiscountPrice: {
        type: Number,
        default: 0,
    },
    selectAll: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const CartModel = mongoose_1.default.model("Cart", cartSchema);
exports.default = CartModel;
//# sourceMappingURL=cart.model.js.map