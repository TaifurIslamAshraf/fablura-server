"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatus = exports.getSealesReport = exports.deleteOrders = exports.getAllOrders = exports.updateOrderStatus = exports.getUserOrders = exports.getSignleOrder = exports.createOrder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = __importDefault(require("../config/secret"));
const errorHandler_1 = require("../lib/errorHandler");
const generateId_1 = require("../lib/generateId");
const sendMail_1 = require("../lib/sendMail");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const order_mode_1 = __importDefault(require("../models/order.mode"));
const order_services_1 = require("../services/order.services");
exports.createOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { phone, fullName, address, orderNots, paymentType, itemsPrice, shippingPrice, orderItems, totalAmount, user, } = req.body;
    const orderData = {
        shippingInfo: {
            phone,
            fullName,
            address,
        },
        orderItems,
        orderNots,
        paymentType,
        itemsPrice,
        shippingPrice,
        totalAmount,
        user: user,
        orderId: (0, generateId_1.generateId)(),
    };
    const order = await order_mode_1.default.create(orderData);
    //set order cookie if user not login
    if (!user) {
        res.cookie(`orders-${order.orderId}`, JSON.stringify(order.orderId), {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }
    const sessionId = req.cookies.cart_session;
    const cartItemIds = orderItems?.map((item) => item._id);
    if (cartItemIds?.length > 0) {
        await cart_model_1.default.findOneAndUpdate({ sessionId }, {
            $pull: {
                cartItem: { _id: { $in: cartItemIds } },
            },
        }, { new: true });
    }
    const emailPayload = {
        email: secret_1.default.smtpMail,
        subject: "New Order Notification",
        templete: "orderConfirmation.ejs",
        data: order,
    };
    await (0, sendMail_1.sendMails)(emailPayload);
    res.status(201).json({
        success: true,
        message: "Order Plased successfull",
        order,
    });
});
//get single order
exports.getSignleOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    // Check if id is empty or invalid
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return (0, errorHandler_1.errorMessage)(res, 400, "Invalid order ID");
    }
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    // Find order without populating the user field
    const order = await order_mode_1.default.findById(objectId);
    if (!order) {
        return (0, errorHandler_1.errorMessage)(res, 404, "Order not found");
    }
    // Check if the user field is present
    if (order?.user) {
        await order.populate("user", "fullName email");
    }
    res.status(200).json({
        success: true,
        message: "Order get successfull",
        order,
    });
});
//get user order
exports.getUserOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.query;
    let userOrders;
    if (userId) {
        userOrders = await order_mode_1.default.find({ user: userId })
            .limit(15)
            .sort({ createdAt: -1 });
    }
    else {
        //get order id from cookie
        const cookies = req.cookies;
        const ordersId = Object.keys(cookies).filter((value) => {
            return value.startsWith("orders");
        });
        const orderPromises = ordersId.map(async (value) => {
            const orderId = value.split("-")[1];
            return order_mode_1.default.findOne({ orderId }).limit(15).sort({ createdAt: -1 });
        });
        const cookiesOrder = await Promise.all(orderPromises);
        userOrders = cookiesOrder.filter(Boolean);
    }
    if (userOrders.length === 0) {
        (0, errorHandler_1.errorMessage)(res, 404, "Order not found");
    }
    res.status(200).json({
        success: true,
        message: "Your all order here",
        userOrders,
    });
});
exports.updateOrderStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const userId = res.locals.user?._id;
    const order = await order_mode_1.default.findById(id);
    if (!order) {
        (0, errorHandler_1.errorMessage)(res, 404, "Order not found");
    }
    if (order?.orderStatus === "Delivered") {
        (0, errorHandler_1.errorMessage)(res, 400, "Order alredy deliverd");
    }
    if (order?.orderStatus) {
        order.orderStatus = orderStatus;
    }
    if (orderStatus === "Delivered" && order) {
        //update stock and sold
        order.orderItems.map(async (value) => {
            await (0, order_services_1.updateProductStockSold)(value?.product?.toString(), value?.quantity);
        });
        //update user review counter
        order.orderItems?.forEach(async (value) => {
            await (0, order_services_1.updateReviewInfo)(value?.product.toString(), order?.user?.toString());
        });
        //update deliveredAt
        if (!order.deliveredAt) {
            order.deliveredAt = new Date();
        }
        else {
            order.deliveredAt = new Date(Date.now());
        }
    }
    await order?.save({ validateBeforeSave: true });
    res.status(200).json({
        success: true,
        message: "Order status updated successfull",
        order,
    });
});
//get all orders
exports.getAllOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const orderStatus = req.query.orderStatus || "";
    const filter = {};
    if (orderStatus) {
        filter.orderStatus = orderStatus;
    }
    const orders = await order_mode_1.default.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    const countOrders = await order_mode_1.default.countDocuments(filter);
    const totalPage = Math.ceil(countOrders / limit);
    let totalOrders = {
        totalAmount: 0,
        numOfOrders: orders?.length,
    };
    let totalPandingOrder = {
        totalAmount: 0,
        numOfOrders: 0,
    };
    let totalDeliveredOrder = {
        totalAmount: 0,
        numOfOrders: 0,
    };
    let totalCancelledOrder = {
        totalAmount: 0,
        numOfOrders: 0,
    };
    orders.forEach((value) => {
        totalOrders.totalAmount += value.totalAmount;
        if (value?.orderStatus === "Pending") {
            totalPandingOrder.numOfOrders += 1;
            totalPandingOrder.totalAmount += value?.totalAmount;
        }
        else if (value?.orderStatus === "Delivered") {
            totalDeliveredOrder.numOfOrders += 1;
            totalDeliveredOrder.totalAmount += value?.totalAmount;
        }
        else if (value?.orderStatus === "Cancelled") {
            totalCancelledOrder.numOfOrders += 1;
            totalCancelledOrder.totalAmount += value?.totalAmount;
        }
    });
    res.status(200).json({
        success: true,
        message: "Your all order here",
        orderSummery: {
            totalOrders,
            totalPandingOrder,
            totalDeliveredOrder,
            totalCancelledOrder,
        },
        pagination: {
            numOfOrders: countOrders,
            totalPage: totalPage,
            currentPage: page,
            nextPage: page < totalPage ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        },
        orders,
    });
});
//delete order
exports.deleteOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const order = await order_mode_1.default.findById(id);
    if (!order) {
        (0, errorHandler_1.errorMessage)(res, 200, "order not found");
    }
    await order_mode_1.default.findByIdAndDelete(id, { new: true });
    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});
// get seales report
exports.getSealesReport = (0, express_async_handler_1.default)(async (req, res) => {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1);
    const yearlySales = await order_mode_1.default.aggregate([
        {
            $match: {
                deliveredAt: { $gte: startOfYear, $lt: endOfYear },
                orderStatus: "Delivered",
            },
        },
        {
            $group: {
                _id: { month: { $month: "$deliveredAt" } },
                totalAmount: { $sum: "$totalAmount" },
            },
        },
    ]);
    const monthSales = Array.from({ length: 12 }, (_, monthIndex) => {
        const totalMonth = yearlySales?.find((item) => item?._id?.month === monthIndex + 1);
        return {
            name: new Date(currentDate.getFullYear(), monthIndex, 1).toLocaleString("en-us", { month: "long" }),
            total: totalMonth ? totalMonth.totalAmount : 0,
        };
    });
    res.status(200).json({
        success: true,
        monthSales,
    });
});
exports.getOrderStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const currentDate = new Date();
    const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const orders = await order_mode_1.default.find({
        createdAt: { $gte: startMonth, $lte: endMonth },
    });
    if (!orders) {
        (0, errorHandler_1.errorMessage)(res, 404, "Orders not found");
    }
    const orderSummary = {
        totalPandingOrder: 0,
        totalDeliveredOrder: 0,
        totalCancelledOrder: 0,
        totalShippedOrder: 0,
        totalProcessingOrder: 0,
    };
    orders.forEach((order) => {
        switch (order.orderStatus) {
            case "Pending":
                orderSummary.totalPandingOrder++;
                break;
            case "Delivered":
                orderSummary.totalDeliveredOrder++;
                break;
            case "Cancelled":
                orderSummary.totalCancelledOrder++;
                break;
            case "Processing":
                orderSummary.totalProcessingOrder++;
                break;
            case "Shipped":
                orderSummary.totalShippedOrder++;
                break;
            default:
                break;
        }
    });
    res.status(200).json({
        success: true,
        orderSummary,
    });
});
//# sourceMappingURL=order.controller.js.map