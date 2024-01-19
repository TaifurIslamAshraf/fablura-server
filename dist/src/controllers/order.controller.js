"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrders = exports.getAllOrders = exports.updateOrderStatus = exports.getUserOrders = exports.getSignleOrder = exports.createOrder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHandler_1 = require("../lib/errorHandler");
const generateId_1 = require("../lib/generateId");
const order_mode_1 = __importDefault(require("../models/order.mode"));
const order_services_1 = require("../services/order.services");
exports.createOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { phone, fullName, address, orderNots, paymentType, itemsPrice, shippingPrice, productName, price, quentity, image, product, totalAmount, user, } = req.body;
    const orderData = {
        shippingInfo: {
            phone,
            fullName,
            address,
        },
        orderItems: {
            productName,
            price,
            quentity,
            image,
            product,
        },
        orderNots,
        paymentType,
        itemsPrice,
        shippingPrice,
        totalAmount,
        user,
        orderId: (0, generateId_1.generateId)(),
    };
    const order = await order_mode_1.default.create(orderData);
    //set order cookie if user not login
    if (!user) {
        res.cookie(`orders-${order.orderId}`, JSON.stringify(order), {
            maxAge: 365 * 24 * 60 * 60 * 1000,
        });
    }
    res.status(201).json({
        success: true,
        message: "Order created successfull",
        order,
    });
});
//get single order
exports.getSignleOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const order = await order_mode_1.default.findById(id).populate("user", "fullName email");
    if (!order) {
        (0, errorHandler_1.errorMessage)(res, 404, "Order not found");
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
        userOrders = await order_mode_1.default.find({ user: userId });
    }
    else {
        //get order id from cookie
        const cookies = req.cookies;
        const ordersId = Object.keys(cookies).filter((value) => {
            return value.startsWith("orders");
        });
        const orderPromises = ordersId.map(async (value) => {
            const orderId = value.split("-")[1];
            return order_mode_1.default.findOne({ orderId });
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
            await (0, order_services_1.updateProductStockSold)(value.product.toString(), value.quentity);
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
    const orders = await order_mode_1.default.find().sort({ createdAt: -1 });
    if (!orders) {
        (0, errorHandler_1.errorMessage)(res, 404, "Orders not found");
    }
    let totalOrdersAmount = 0;
    orders.forEach((value) => {
        totalOrdersAmount += value.totalAmount;
    });
    res.status(200).json({
        success: true,
        message: "Your all order here",
        totalOrdersAmount,
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
//# sourceMappingURL=order.controller.js.map