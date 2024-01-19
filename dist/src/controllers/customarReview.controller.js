"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomerReview = exports.getAllCustomerReview = exports.createCustomerReview = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHandler_1 = require("../lib/errorHandler");
const customarReview_model_1 = __importDefault(require("../models/customarReview.model"));
exports.createCustomerReview = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.file) {
        (0, errorHandler_1.errorMessage)(res, 400, "Image is Required");
    }
    const customerReview = await customarReview_model_1.default.create({
        image: req.file?.path,
    });
    res.status(201).json({
        success: true,
        message: "Customer review create successfully",
        customerReview,
    });
});
exports.getAllCustomerReview = (0, express_async_handler_1.default)(async (req, res) => {
    const customerReview = await customarReview_model_1.default.find();
    res.status(201).json({
        success: true,
        message: "All Customer review",
        customerReview,
    });
});
exports.deleteCustomerReview = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const customerReview = await customarReview_model_1.default.findByIdAndDelete(id, {
        new: true,
    });
    if (!customerReview) {
        (0, errorHandler_1.errorMessage)(res, 404, "Customer review not found");
    }
    res.status(201).json({
        success: true,
        message: "All Customer review",
        customerReview,
    });
});
//# sourceMappingURL=customarReview.controller.js.map