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
const mongoose_1 = __importStar(require("mongoose"));
const productReviews = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Review user is required"],
    },
    fullName: {
        type: String,
        required: [true, "Review user name is required"],
    },
    avatar: {
        type: String,
    },
    rating: {
        type: Number,
        required: [true, "Review rating is required"],
        maxlength: [5, "max rating number 5"],
    },
    comment: {
        type: String,
        required: [true, "Review comment is required"],
    },
    approved: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
        default: () => new Date(),
    },
});
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "product name is required"],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "product slug is required"],
        lowercase: true,
        trim: true,
    },
    price: {
        type: Number,
    },
    discountPrice: {
        type: String,
        default: 0,
        required: [true, "Product descountPrice price is required"],
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    colors: {
        type: [
            {
                name: { type: String, required: true },
                stock: { type: Boolean, required: true },
            }
        ],
        required: [true, "Product colors are required"],
    },
    size: {
        type: [
            {
                name: { type: String, required: true },
                available: { type: Boolean, required: true },
            }
        ],
        required: [true, "Product size are required"],
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
    },
    sold: {
        type: Number,
        default: 0,
    },
    soldAt: {
        type: Date,
        default: Date.now(),
    },
    shipping: {
        type: Number,
        required: [true, "Product shipping price is required"],
    },
    images: {
        type: [String],
        required: [true, "Product images is required"],
    },
    subcategory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "subCategory id is required"],
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category id is required"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [productReviews],
}, {
    timestamps: true,
});
productSchema.index({
    name: "text",
    description: "text",
    slug: "text",
}, {
    weights: {
        name: 5,
        description: 3,
        slug: 4,
    },
});
const ProductModel = mongoose_1.default.model("Product", productSchema);
exports.default = ProductModel;
//# sourceMappingURL=product.model.js.map