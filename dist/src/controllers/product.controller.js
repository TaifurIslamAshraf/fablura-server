"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockStatus = exports.cartProducts = exports.getProductReviews = exports.getAllProductsReviews = exports.deleteReview = exports.updateReviewStatus = exports.createReviews = exports.getResentSoldProducts = exports.getAllProducts = exports.getSingleProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const lodash_1 = __importDefault(require("lodash"));
const deleteImage_1 = require("../lib/deleteImage");
const errorHandler_1 = require("../lib/errorHandler");
const slugify_1 = require("../lib/slugify");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const category_model_1 = require("../models/category.model");
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
// create products -- admin
exports.createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, price, discountPrice, stock, shipping, category, subcategory, description, colors, size } = req.body;
    let productData = {
        name,
        description,
        price: parseInt(price),
        discountPrice,
        stock: parseInt(stock),
        colors,
        size,
        shipping: parseInt(shipping),
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
        await (0, deleteImage_1.deleteMultipleImages)(imagesPath);
        (0, errorHandler_1.errorMessage)(res, 400, "Product name should be unique");
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
    const { id, name, price, discountPrice, stock, sold, shipping, category, subcategory, description, colors, size } = req.body;
    let productData = {
        name,
        price,
        discountPrice,
        description,
        colors,
        stock,
        sold,
        shipping,
        category,
        subcategory,
        size
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
    if (productWithSameName && productWithSameName?._id.toString() !== id) {
        (0, deleteImage_1.deleteMultipleImages)(imagesPath);
        (0, errorHandler_1.errorMessage)(res, 400, "Product name should be unique");
    }
    if (imagesPath.length > 0) {
        productData.images = imagesPath;
    }
    // Deep merge the new data with existing product data using Lodash
    const updatedProductData = lodash_1.default.merge(existingProduct.toObject(), productData);
    const updatedProduct = await product_model_1.default.findByIdAndUpdate(id, updatedProductData, {
        new: true,
    });
    if (updatedProduct && existingProduct?.images && imagesPath.length > 0) {
        (0, deleteImage_1.deleteMultipleImages)(existingProduct.images);
    }
    //price sync with cart price
    if (price || discountPrice) {
        const cartToUpdate = await cart_model_1.default.find({
            "cartItem.productId": id,
        });
        await Promise.all(cartToUpdate.map(async (cart) => {
            cart.cartItem.forEach((item) => {
                if (item.productId.toString() === id) {
                    (item.price = price), (item.discountPrice = discountPrice);
                }
            });
            await cart.save();
        }));
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
    const product = await product_model_1.default.findOne({ slug })
        .populate("category subcategory")
        .select("-reviews");
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found !");
    }
    //find related products
    const relatedProduct = await product_model_1.default.find({
        subcategory: product?.subcategory,
        _id: { $ne: product?._id },
    }, {
        name: 1,
        ratings: 1,
        numOfReviews: 1,
        price: 1,
        discountPrice: 1,
        images: 1,
        slug: 1,
    }).limit(6);
    res.status(200).json({
        success: true,
        product,
        relatedProduct,
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
    const filter = {};
    if (search) {
        filter.$text = { $search: search };
    }
    if (category) {
        filter.category = category;
    }
    if (subcategory) {
        filter.subcategory = subcategory;
    }
    // Use $expr to compare discountPrice as a number
    filter.$expr = {
        $and: [
            { $gte: [{ $toDouble: "$discountPrice" }, minPrice] },
            { $lte: [{ $toDouble: "$discountPrice" }, maxPrice] },
        ],
    };
    if (ratings > 0) {
        filter.ratings = { $gte: ratings };
    }
    console.log("Filter:", JSON.stringify(filter, null, 2)); // Debug log
    const products = await product_model_1.default.find(filter)
        .select("-reviews")
        .populate(["category", "subcategory"])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    if (!products || products.length < 1) {
        return (0, errorHandler_1.errorMessage)(res, 404, "No Product available");
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
    if (!user) {
        (0, errorHandler_1.errorMessage)(res, 404, "User Not found");
    }
    const review = {
        user: user._id,
        fullName: user.fullName,
        avatar: user?.avatar,
        rating,
        comment,
    };
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    if (product?.reviews) {
        const reviewValidity = product?.reviews.filter((value) => value.user.toString() === user?._id.toString());
        const reviewCount = user?.reviewsInfo?.find((item) => item?.productId === productId);
        if (reviewCount?.reviewsCounter === undefined) {
            (0, errorHandler_1.errorMessage)(res, 400, "You have to buy this item");
        }
        if (reviewValidity.length >= reviewCount?.reviewsCounter) {
            (0, errorHandler_1.errorMessage)(res, 400, "You have to buy this item");
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
    await product?.save();
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
    const { reviewId, productId } = req.body;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not found");
    }
    if (product?.reviews) {
        const productIndex = product?.reviews?.findIndex((value) => value._id.toString() === reviewId);
        if (productIndex === -1) {
            (0, errorHandler_1.errorMessage)(res, 404, "review not found");
        }
        product?.reviews?.splice(productIndex, 1);
    }
    let avgRating = 0;
    if (product?.reviews?.length > 0 && product?.reviews) {
        avgRating =
            product.reviews.reduce((total, review) => total + review.rating, 0) /
                product.reviews.length;
        product.ratings = avgRating;
        product.numOfReviews = product.reviews.length;
    }
    else if (product?.reviews?.length === 0) {
        product.ratings = 0;
        product.numOfReviews = 0;
    }
    await product?.save();
    res.status(200).json({
        success: true,
        message: "Product review deleted successfully",
        product,
    });
});
//get all reviews -- admin
exports.getAllProductsReviews = (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const productsReviews = await product_model_1.default.aggregate([
        {
            $unwind: "$reviews",
        },
        {
            $match: {
                "reviews.approved": false,
            },
        },
        {
            $group: {
                _id: "$_id",
                productName: { $first: "$name" },
                productId: { $first: "$_id" },
                reviews: { $push: "$reviews" },
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
    ]);
    const countProduct = await product_model_1.default.countDocuments();
    res.status(200).json({
        success: true,
        message: "All product reviews",
        productsReviews,
        pagination: {
            totalPage: Math.ceil(countProduct / limit),
            currentPage: page,
            nextPage: page + 1,
            prevPage: page - 1,
        },
    });
});
//get product reviews
exports.getProductReviews = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId, productId } = req.query;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Products not found");
    }
    const userLength = await user_model_1.default.countDocuments();
    let reviews = product?.reviews || [];
    let productReviews = reviews?.filter((item) => {
        return (userId && item?.user?.toString() === userId) || item.approved;
    });
    res.status(200).json({
        success: true,
        message: "all product reviews",
        productReviews,
        userLength,
    });
});
//get cart product
exports.cartProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const productId = req.cookies.product_cart;
    const productIdsArray = JSON.parse(productId);
    if (!productIdsArray && productIdsArray.length === 0) {
        (0, errorHandler_1.errorMessage)(res, 404, "Cart item not found");
    }
    const products = await product_model_1.default.find({ _id: { $in: productIdsArray } });
    if (!products || products.length === 0) {
        (0, errorHandler_1.errorMessage)(res, 404, "Products not found");
    }
    const formattedProducts = products.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images && product.images.length > 0 ? product.images[0] : null,
        discountPrice: product.discountPrice,
        slug: product.slug,
    }));
    res.status(200).json({
        success: true,
        message: "All cart items here",
        products: formattedProducts,
    });
});
//chart
exports.getStockStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const productStockAvailable = await product_model_1.default.countDocuments({
        stock: { $gt: 0 },
    });
    const productStockOut = await product_model_1.default.countDocuments({
        stock: { $lte: 0 },
    });
    res.status(200).json({
        success: true,
        productStockAvailable,
        productStockOut,
    });
});
//# sourceMappingURL=product.controller.js.map