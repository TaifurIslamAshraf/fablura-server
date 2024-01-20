"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = exports.deleteReview = exports.updateReviewStatus = exports.createReviews = exports.getResentSoldProducts = exports.getAllProducts = exports.getSingleProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const deleteImage_1 = require("../lib/deleteImage");
const errorHandler_1 = require("../lib/errorHandler");
const slugify_1 = require("../lib/slugify");
const category_model_1 = require("../models/category.model");
const product_model_1 = __importDefault(require("../models/product.model"));
// create products -- admin
exports.createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, descriptionType, price, discountPrice, stock, sold, shipping, category, subcategory, ingredients, foodDesc, color, brand, warrantyPeriod, countryOrigin, batteryCapacity, features, dimensions, model, waterproof, powerSupply, bodyMaterials, chargingTime, } = req.body;
    let productData = {
        name,
        descriptionType,
        price,
        discountPrice,
        stock,
        sold,
        shipping,
        category,
        subcategory,
        reviews: [],
    };
    productData.slug = (0, slugify_1.slugify)(name);
    const imagesPath = req.files.map((file) => file.path);
    if (!imagesPath || imagesPath.length === 0) {
        (0, errorHandler_1.errorMessage)(res, 400, "Products Images are required");
    }
    if (req.files) {
        productData.images = imagesPath;
    }
    const nameisExitst = await product_model_1.default.findOne({ name });
    if (nameisExitst) {
        (0, deleteImage_1.deleteMultipleImages)(imagesPath);
        (0, errorHandler_1.errorMessage)(res, 400, "Product name should be unique");
    }
    // Add description field based on descriptionType
    if (descriptionType === "foods") {
        productData = {
            ...productData,
            description: {
                ingredients,
                foodDesc,
            },
        };
    }
    else if (descriptionType === "electronics") {
        productData = {
            ...productData,
            description: {
                color,
                brand,
                warrantyPeriod,
                countryOrigin,
                batteryCapacity,
                features,
                dimensions,
                model,
                waterproof,
                powerSupply,
                bodyMaterials,
                chargingTime,
            },
        };
    }
    const product = await product_model_1.default.create(productData);
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});
//update product -- admin
exports.updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { id, name, price, discountPrice, stock, sold, shipping, category, subcategory, descriptionType, ingredients, foodDesc, color, brand, warrantyPeriod, countryOrigin, batteryCapacity, features, dimensions, model, waterproof, powerSupply, bodyMaterials, chargingTime, } = req.body;
    let productData = {
        name,
        price,
        discountPrice,
        stock,
        sold,
        shipping,
        category,
        subcategory,
    };
    if (name) {
        productData.slug = (0, slugify_1.slugify)(name);
    }
    const imagesPath = req.files.map((file) => file.path);
    const existingProduct = await product_model_1.default.findById(id);
    if (!existingProduct) {
        (0, deleteImage_1.deleteMultipleImages)(imagesPath);
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    const productWithSameName = await product_model_1.default.findOne({ name });
    if (productWithSameName) {
        (0, deleteImage_1.deleteMultipleImages)(imagesPath);
        (0, errorHandler_1.errorMessage)(res, 400, "Product name should be unique");
    }
    // Add description field based on descriptionType
    let updatedDescription = {};
    if (descriptionType === "foods" ||
        existingProduct?.descriptionType === "foods") {
        updatedDescription = {
            ...existingProduct?.description,
            ...(ingredients && { ingredients }),
            ...(foodDesc && { foodDesc }),
        };
    }
    else if (descriptionType === "electronics" ||
        existingProduct?.descriptionType === "electronics") {
        updatedDescription = {
            ...existingProduct?.description,
            ...(color && { color }),
            ...(brand && { brand }),
            ...(warrantyPeriod && { warrantyPeriod }),
            ...(countryOrigin && { countryOrigin }),
            ...(batteryCapacity && { batteryCapacity }),
            ...(features && { features }),
            ...(dimensions && { dimensions }),
            ...(model && { model }),
            ...(waterproof && { waterproof }),
            ...(powerSupply && { powerSupply }),
            ...(bodyMaterials && { bodyMaterials }),
            ...(chargingTime && { chargingTime }),
        };
    }
    if (imagesPath.length > 0) {
        productData.images = imagesPath;
    }
    productData.description = updatedDescription;
    const updatedProduct = await product_model_1.default.findByIdAndUpdate(id, productData, {
        new: true,
    });
    if (updatedProduct && existingProduct?.images && imagesPath.length > 0) {
        (0, deleteImage_1.deleteMultipleImages)(existingProduct.images);
    }
    res.status(200).json({
        success: true,
        message: "Product updated successfull",
        updatedProduct,
    });
});
//delete product
exports.deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found !");
    }
    if (product?.images) {
        await (0, deleteImage_1.deleteMultipleImages)(product.images);
    }
    await product?.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product deleted successfull",
    });
});
//get single product
exports.getSingleProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { slug } = req.params;
    const product = await product_model_1.default.findOne({ slug }).populate("category");
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found !");
    }
    res.status(200).json({
        success: true,
        product,
    });
});
// get all products
exports.getAllProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const subcategory = req.query.subcategory || "";
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
    const ratings = parseFloat(req.query.ratings) || 0;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
        // category: category,
        // subcategory: subcategory,
        // price: { $gte: minPrice, $lte: maxPrice },
        // ratings: { $gte: ratings },
        $or: [{ name: { $regex: searchRegExp } }],
    } || {};
    if (category) {
        filter.category = category;
    }
    if (subcategory) {
        filter.subcategory = subcategory;
    }
    filter.discountPrice = { $lte: maxPrice, $gte: minPrice };
    filter.ratings = { $gte: ratings };
    const products = await product_model_1.default.find(filter)
        .populate(["category", "subcategory"])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    if (!products || products.length < 1) {
        (0, errorHandler_1.errorMessage)(res, 404, "No Product availble");
    }
    const productCount = await product_model_1.default.countDocuments(filter);
    const categories = await product_model_1.default.distinct("category", filter);
    const allSubcategory = await category_model_1.SubCategoryModel.find({
        category: { $in: categories },
    });
    res.status(200).json({
        success: true,
        message: "All products here",
        products,
        allSubcategory,
        pagination: {
            numberOfProducts: productCount,
            totalPage: Math.ceil(productCount / limit),
            currentPage: page,
            nextPage: page + 1,
            prevPage: page - 1,
        },
    });
});
//get resent sold product
exports.getResentSoldProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await product_model_1.default.find().sort({ soldAt: -1 }).limit(10);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    res.status(200).json({
        message: "Resently sold product",
        success: true,
        product,
    });
});
//create review
exports.createReviews = (0, express_async_handler_1.default)(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const user = res.locals.user;
    const review = {
        user: user._id,
        fullName: user.fullName,
        rating,
        comment,
    };
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    if (product?.reviews) {
        const isReviewd = product?.reviews.some((rev) => rev.user.toString() === user._id.toString());
        if (isReviewd) {
            (0, errorHandler_1.errorMessage)(res, 400, "You alredy give a review");
        }
    }
    if (product?.reviews) {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    //product rating avarage
    let avg = 0;
    product?.reviews?.forEach((value) => {
        avg += value.rating;
    });
    if (product?.reviews) {
        product.ratings = avg / product.reviews.length;
    }
    await product?.save({ validateBeforeSave: true });
    res.status(200).json({
        success: true,
        message: "review created successfull",
        review: product?.reviews,
    });
});
//update review status
exports.updateReviewStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { reviewId, productId, approved } = req.body;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    if (product?.reviews) {
        const review = product.reviews.find((value) => {
            return value._id.toString() === reviewId;
        });
        if (review?.approved !== undefined) {
            review.approved = Boolean(approved);
        }
        else {
            (0, errorHandler_1.errorMessage)(res, 404, "Review not exits");
        }
    }
    await product?.save();
    res.status(200).json({
        success: true,
        message: "Product review status updated",
        product,
    });
});
//delete review --admin
exports.deleteReview = (0, express_async_handler_1.default)(async (req, res) => {
    const { reviewId, productId } = req.params;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    if (product?.reviews) {
        const productIndex = product?.reviews?.findIndex((value) => value._id.toString() === reviewId.toString());
        if (productIndex === -1) {
            (0, errorHandler_1.errorMessage)(res, 404, "review not found");
        }
        product?.reviews?.splice(productIndex, 1);
    }
    let avg = 0;
    product?.reviews?.forEach((value) => {
        avg += value.rating;
    });
    if (product?.reviews) {
        product.ratings = avg / product.reviews.length;
        product.numOfReviews = product.reviews.length;
    }
    await product?.save({ validateBeforeSave: true });
    res.status(200).json({
        success: true,
        message: "Product review deleted successfully",
        product,
    });
});
//get product reviews
exports.getProductReviews = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId, productId } = req.body;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Products not found");
    }
    let reviews = product?.reviews || [];
    let productReviews = [];
    //check if user give a reviews
    if (userId && reviews.length > 0) {
        reviews.forEach((rev) => {
            if (rev.user.toString() === userId) {
                productReviews.push(rev);
            }
        });
    }
    //check if review is approved
    if (reviews.length > 0) {
        reviews.forEach((rev) => {
            if (rev.approved) {
                productReviews.push(rev);
            }
        });
    }
    res.status(200).json({
        success: true,
        message: "all product reviews",
        productReviews,
    });
});
//# sourceMappingURL=product.controller.js.map