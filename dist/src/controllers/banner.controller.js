"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanners = exports.getSingleBanners = exports.getAllBanners = exports.createBanner = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const deleteImage_1 = require("../lib/deleteImage");
const errorHandler_1 = require("../lib/errorHandler");
const banner_model_1 = __importDefault(require("../models/banner.model"));
exports.createBanner = (0, express_async_handler_1.default)(async (req, res) => {
    const { bannerType, category } = req.body;
    if (!req.file) {
        (0, errorHandler_1.errorMessage)(res, 400, "Banner image is required");
    }
    if (bannerType === "categoryBanner" && !category) {
        if (req.file) {
            await (0, deleteImage_1.deleteImage)(req.file.path);
        }
        (0, errorHandler_1.errorMessage)(res, 400, "category is required");
    }
    if (category && bannerType !== "categoryBanner") {
        if (req.file) {
            await (0, deleteImage_1.deleteImage)(req.file.path);
        }
        (0, errorHandler_1.errorMessage)(res, 400, "Your banner type should be categoryBanner");
    }
    const banner = await banner_model_1.default.create({
        bannerType,
        category,
        image: req.file?.path,
    });
    res.status(201).json({
        success: true,
        message: "Banner create successfull",
        banner,
    });
});
exports.getAllBanners = (0, express_async_handler_1.default)(async (req, res) => {
    const { bannerType, category } = req.query;
    let query = {};
    if (bannerType) {
        query = { bannerType };
    }
    if (category) {
        query = { category };
    }
    const banner = await banner_model_1.default.find(query).populate("category");
    if (!banner) {
        (0, errorHandler_1.errorMessage)(res, 404, "Banner not found");
    }
    res.status(201).json({
        success: true,
        message: "All Banners here",
        banner,
    });
});
exports.getSingleBanners = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const banner = await banner_model_1.default.findById(id).populate("category");
    if (!banner) {
        (0, errorHandler_1.errorMessage)(res, 404, "Banner not found");
    }
    res.status(201).json({
        success: true,
        banner,
    });
});
exports.deleteBanners = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const banner = await banner_model_1.default.findByIdAndDelete(id, { new: true });
    if (!banner) {
        (0, errorHandler_1.errorMessage)(res, 404, "Banner not found");
    }
    if (banner?.image) {
        (0, deleteImage_1.deleteImage)(banner.image);
    }
    res.status(201).json({
        success: true,
        message: "banner deleted successfully",
    });
});
//# sourceMappingURL=banner.controller.js.map