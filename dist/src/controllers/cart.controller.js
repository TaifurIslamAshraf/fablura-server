"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = exports.syncCart = exports.getCartItem = exports.addCartItem = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const node_cron_1 = __importDefault(require("node-cron"));
const errorHandler_1 = require("../lib/errorHandler");
const generateId_1 = require("../lib/generateId");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
exports.addCartItem = (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, colors, size } = req.body;
    const cartSession = req.cookies.cart_session;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        (0, errorHandler_1.errorMessage)(res, 404, "Product not exist");
    }
    if (cartSession) {
        const cart = await cart_model_1.default.findOne({ sessionId: cartSession });
        if (!cart) {
            (0, errorHandler_1.errorMessage)(res, 404, "Cart item not found");
        }
        const existingItem = cart?.cartItem.find(item => item.productId.toString() === productId &&
            item.size === size &&
            item.colors === colors);
        if (existingItem) {
            (0, errorHandler_1.errorMessage)(res, 400, "Product Alredy In Cart");
        }
        const cartItems = await cart_model_1.default.findOneAndUpdate({ sessionId: cartSession }, {
            $push: {
                cartItem: {
                    productId,
                    colors: colors,
                    size: size,
                    price: product?.price,
                    discountPrice: parseInt(product?.discountPrice),
                },
            },
        }, { runValidators: true, new: true });
        res.status(200).json({
            success: true,
            message: "Product Add to cart",
            cartItems,
        });
    }
    else {
        const sessionId = (0, generateId_1.generateId)();
        const newCart = await cart_model_1.default.create({
            sessionId: sessionId,
            cartItem: {
                productId,
                colors: colors,
                size: size,
                price: product?.price,
                discountPrice: parseInt(product?.discountPrice),
            },
        });
        // set cookie session
        const expiarationDate = new Date();
        expiarationDate.setMonth(expiarationDate.getMonth() + 2);
        res.cookie("cart_session", sessionId, {
            httpOnly: true,
            expires: expiarationDate,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            message: "Product Add to cart",
            cartItems: newCart,
        });
    }
});
exports.getCartItem = (0, express_async_handler_1.default)(async (req, res) => {
    // find session cart
    const sessionId = req.cookies.cart_session;
    if (!sessionId) {
        (0, errorHandler_1.errorMessage)(res, 400, "Invalid Cart Product");
    }
    const cart = await cart_model_1.default.aggregate([
        {
            $match: { sessionId: sessionId },
        },
        {
            $unwind: "$cartItem", // Flatten the cartItem array
        },
        {
            $lookup: {
                from: "products",
                localField: "cartItem.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $project: {
                "cartItem.productId": 1,
                "cartItem.quantity": 1,
                "cartItem.selected": 1,
                "cartItem.price": 1,
                "cartItem.discountPrice": 1,
                "cartItem.colors": 1,
                "cartItem.size": 1,
                "cartItem._id": 1,
                "cartItem.product": {
                    name: { $arrayElemAt: ["$product.name", 0] },
                    image: {
                        $arrayElemAt: [{ $arrayElemAt: ["$product.images", 0] }, 0],
                    },
                    colors: {
                        $arrayElemAt: ["$product.colors", 0]
                    },
                    size: {
                        $arrayElemAt: ["$product.size", 0]
                    },
                    shipping: { $arrayElemAt: ["$product.shipping", 0] },
                    slug: { $arrayElemAt: ["$product.slug", 0] },
                },
                selectAll: "$selectAll",
            },
        },
        {
            $group: {
                _id: "$_id",
                sessionId: { $first: "$sessionId" },
                cartItem: { $push: "$cartItem" },
                totalMainPrice: { $first: "$totalMainPrice" },
                totalDiscountPrice: { $first: "$totalDiscountPrice" },
                selectAll: { $max: "$selectAll" },
            },
        },
    ]);
    res.status(200).json({
        success: true,
        message: "cart products",
        cartItem: cart[0].cartItem,
        selectAll: cart.length > 0 ? cart[0].selectAll : null,
    });
});
exports.syncCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { isSelect, cartItemId, isSelectAll, cartQuantity, deleteCartItem, colors, size } = req.query;
    const sessionId = req.cookies.cart_session;
    if (!sessionId) {
        (0, errorHandler_1.errorMessage)(res, 400, "Invalid Cart Product");
        return;
    }
    if (isSelect !== undefined && cartItemId) {
        // Toggle product selection
        const updatedCartItem = await cart_model_1.default.findOneAndUpdate({
            sessionId,
            "cartItem._id": cartItemId,
        }, {
            $set: {
                "cartItem.$.selected": isSelect === "false" ? false : true,
            },
        }, { new: true });
        if (!updatedCartItem) {
            (0, errorHandler_1.errorMessage)(res, 404, "cart product not found");
            return;
        }
        // Check if all items are selected
        const allItemsSelected = updatedCartItem.cartItem.every((item) => item.selected);
        // Update selectAll based on the condition for the specific cartId
        await cart_model_1.default.findOneAndUpdate({
            sessionId,
        }, {
            selectAll: allItemsSelected,
        }, { new: true });
    }
    if (isSelectAll !== undefined) {
        // Toggle select all
        const isSelectedAll = isSelectAll === "false" ? false : true;
        await cart_model_1.default.findOneAndUpdate({
            sessionId,
        }, {
            selectAll: isSelectedAll,
            $set: { "cartItem.$[].selected": isSelectedAll },
        }, { new: true });
    }
    if (cartQuantity && cartItemId) {
        // Update product quantity
        const pro = await cart_model_1.default.findOneAndUpdate({
            sessionId,
            "cartItem._id": cartItemId,
        }, {
            $set: { "cartItem.$.quantity": parseInt(cartQuantity) },
        }, { new: true });
    }
    // if (colors && cartItemId) {
    //   // Update product selected colors
    //   await CartModel.findOneAndUpdate(
    //     {
    //       sessionId,
    //       "cartItem._id": cartItemId,
    //     },
    //     {
    //       $set: { "cartItem.$.colors": colors },
    //     },
    //     { new: true }
    //   );
    // }
    // if (size && cartItemId) {
    //   // Update product selected colors
    //   await CartModel.findOneAndUpdate(
    //     {
    //       sessionId,
    //       "cartItem._id": cartItemId,
    //     },
    //     {
    //       $set: { "cartItem.$.size": size },
    //     },
    //     { new: true }
    //   );
    // }
    if ((colors || size) && cartItemId) {
        const cart = await cart_model_1.default.findOne({ sessionId });
        if (!cart) {
            (0, errorHandler_1.errorMessage)(res, 404, "Cart not found");
            return;
        }
        const updatingItem = cart.cartItem.id(cartItemId);
        if (!updatingItem) {
            (0, errorHandler_1.errorMessage)(res, 404, "Cart item not found");
            return;
        }
        const newColors = colors || updatingItem.colors;
        const newSize = size || updatingItem.size;
        // Check if a product with the same ID, color, and size already exists
        const existingItem = cart.cartItem.find((item) => item?._id?.toString() !== cartItemId &&
            item.productId.toString() === updatingItem.productId.toString() &&
            item.colors === newColors &&
            item.size === newSize);
        if (existingItem) {
            (0, errorHandler_1.errorMessage)(res, 400, "Product already exists in the cart");
            return;
        }
        // If no duplicate found, update the item
        if (colors) {
            updatingItem.colors = colors;
        }
        if (size) {
            updatingItem.size = size;
        }
        await cart.save();
    }
    if (deleteCartItem !== undefined && cartItemId) {
        // Delete specific item from the cart
        const updatedCartItem = await cart_model_1.default.findOneAndUpdate({ sessionId }, {
            $pull: {
                cartItem: { _id: cartItemId },
            },
        }, { new: true });
        const allItemsSelected = updatedCartItem?.cartItem.every((item) => item.selected);
        await cart_model_1.default.findOneAndUpdate({ sessionId }, {
            selectAll: allItemsSelected,
        }, {
            new: true,
        });
    }
    res.status(200).json({
        success: true,
        message: "cart product was sync",
    });
});
exports.calculatePrice = (0, express_async_handler_1.default)(async (req, res) => {
    // find session cart
    const sessionId = req.cookies.cart_session;
    if (!sessionId) {
        (0, errorHandler_1.errorMessage)(res, 400, "Invalid Cart Product");
    }
    const cart = await cart_model_1.default.findOne({ sessionId });
    if (!cart) {
        (0, errorHandler_1.errorMessage)(res, 400, "Cart not found");
        return;
    }
    const selectedProduct = cart.cartItem.filter((item) => item.selected === true);
    const totalMainPrice = selectedProduct.reduce((aqu, curr) => aqu + curr.price * curr.quantity, 0);
    const totalDiscountPrice = selectedProduct.reduce((aqu, curr) => aqu + curr.discountPrice * curr.quantity, 0);
    cart.totalMainPrice = totalMainPrice;
    cart.totalDiscountPrice = totalDiscountPrice;
    await cart.save();
    res.status(200).json({
        success: true,
        totalMainPrice,
        totalDiscountPrice,
    });
});
//delete cart two month ago cart
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    try {
        const twoMothAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        await cart_model_1.default.deleteMany({
            createdAt: { $lt: twoMothAgo },
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
//# sourceMappingURL=cart.controller.js.map