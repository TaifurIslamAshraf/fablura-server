"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryModel = exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "category name is required"],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "category slug is required"],
        lowercase: true,
    },
}, {
    timestamps: true,
});
exports.CategoryModel = (0, mongoose_1.model)("Category", categorySchema);
const subCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "category name is required"],
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "category slug is required"],
        lowercase: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
    },
}, {
    timestamps: true,
});
exports.SubCategoryModel = (0, mongoose_1.model)("SubCategory", subCategorySchema);
//# sourceMappingURL=category.model.js.map