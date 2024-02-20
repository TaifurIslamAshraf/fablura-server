"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.getSignleSubCategory = exports.getAllSubCategory = exports.createSubCategory = exports.deleteCategory = exports.updateCategory = exports.getSignleCategory = exports.getAllCategory = exports.createCategory = exports.getAllCategoryAndSubCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHandler_1 = require("../lib/errorHandler");
const slugify_1 = require("../lib/slugify");
const category_model_1 = require("../models/category.model");
//get all category and sub category
exports.getAllCategoryAndSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await category_model_1.CategoryModel.aggregate([
        {
            $lookup: {
                from: "subcategories",
                localField: "_id",
                foreignField: "category",
                as: "subcategory",
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                slug: 1,
                subcategory: {
                    $map: {
                        input: "$subcategory",
                        as: "subcategory",
                        in: {
                            _id: "$$subcategory._id",
                            name: "$$subcategory.name",
                            slug: "$$subcategory.slug",
                        },
                    },
                },
            },
        },
    ]);
    if (!category) {
        (0, errorHandler_1.errorMessage)(res, 404, "Category not found");
    }
    res.status(200).json({
        message: "Category and subcategory",
        category,
    });
});
// category crud endpoint
exports.createCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name } = req.body;
    const slug = (0, slugify_1.slugify)(name);
    const isExistCategory = await category_model_1.CategoryModel.findOne({ name: name });
    if (isExistCategory) {
        (0, errorHandler_1.errorMessage)(res, 400, "category alredy exist");
    }
    const category = await category_model_1.CategoryModel.create({
        name,
        slug,
    });
    res.status(201).json({
        success: true,
        message: "Category create successfull",
        category,
    });
});
exports.getAllCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await category_model_1.CategoryModel.find();
    if (!category) {
        (0, errorHandler_1.errorMessage)(res, 404, "You dont have any category");
    }
    const categoryLength = await category_model_1.CategoryModel.countDocuments();
    res.status(201).json({
        success: true,
        category,
        categoryLength,
    });
});
exports.getSignleCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const slug = req.params.slug;
    const category = await category_model_1.CategoryModel.findOne({ slug: slug });
    if (!category) {
        (0, errorHandler_1.errorMessage)(res, 404, "Category not found!");
    }
    res.status(201).json({
        success: true,
        category,
    });
});
exports.updateCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, id } = req.body;
    const slug = (0, slugify_1.slugify)(name);
    const category = await category_model_1.CategoryModel.findByIdAndUpdate(id, {
        name,
        slug,
    }, { new: true });
    if (!category) {
        (0, errorHandler_1.errorMessage)(res, 404, "Category not found!");
    }
    res.status(201).json({
        success: true,
        message: "Category updated successfull",
        category,
    });
});
exports.deleteCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    const category = await category_model_1.CategoryModel.findByIdAndDelete({ _id: id }, { new: true });
    if (!category) {
        (0, errorHandler_1.errorMessage)(res, 404, "Category not found!");
    }
    const subcategory = await category_model_1.SubCategoryModel.deleteMany({ category: id });
    res.status(201).json({
        success: true,
        message: "category and subcategory deleted successfull",
    });
});
// sub category crud endpoint
exports.createSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, category } = req.body;
    const slug = (0, slugify_1.slugify)(name);
    const isExistSubcategory = await category_model_1.SubCategoryModel.findOne({ name: name });
    if (isExistSubcategory) {
        (0, errorHandler_1.errorMessage)(res, 400, "subcategory alredy exist");
    }
    const subcategory = await category_model_1.SubCategoryModel.create({
        name,
        slug,
        category: category,
    });
    res.status(201).json({
        success: true,
        message: "Subcategory create successfull",
        subcategory,
    });
});
exports.getAllSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const subcategory = await category_model_1.SubCategoryModel.find();
    if (!subcategory) {
        (0, errorHandler_1.errorMessage)(res, 404, "You dont have any subcategory");
    }
    res.status(201).json({
        success: true,
        subcategory,
    });
});
exports.getSignleSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const slug = req.params.slug;
    const subcategory = await category_model_1.SubCategoryModel.findOne({ slug: slug });
    if (!subcategory) {
        (0, errorHandler_1.errorMessage)(res, 404, "subcategory not found!");
    }
    res.status(201).json({
        success: true,
        subcategory,
    });
});
exports.updateSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, id } = req.body;
    const slug = (0, slugify_1.slugify)(name);
    const subcategory = await category_model_1.SubCategoryModel.findByIdAndUpdate(id, {
        name,
        slug,
    }, { new: true });
    if (!subcategory) {
        (0, errorHandler_1.errorMessage)(res, 404, "subcategory not found!");
    }
    res.status(201).json({
        success: true,
        message: "subcategory updated successfull",
        subcategory,
    });
});
exports.deleteSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const id = req.params.id;
    const subcategory = await category_model_1.SubCategoryModel.findByIdAndDelete({ _id: id }, { new: true });
    if (!subcategory) {
        (0, errorHandler_1.errorMessage)(res, 404, "subcategory not found!");
    }
    res.status(201).json({
        success: true,
        message: "subcategory deleted successfull",
    });
});
//# sourceMappingURL=category.controller.js.map