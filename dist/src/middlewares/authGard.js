"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = exports.isAuthenticated = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const secret_1 = __importDefault(require("../config/secret"));
const errorHandler_1 = require("../lib/errorHandler");
const verifyToken_1 = require("../lib/verifyToken");
const user_model_1 = __importDefault(require("../models/user.model"));
exports.isAuthenticated = (0, express_async_handler_1.default)(async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
        (0, errorHandler_1.errorMessage)(res, 400, "Please login to access this recourse");
    }
    const decoded = (0, verifyToken_1.verifyJwtToken)(refresh_token, secret_1.default.refreshTokenSecret);
    if (!decoded) {
        (0, errorHandler_1.errorMessage)(res, 400, "Invalid access token. please login");
    }
    const user = await user_model_1.default.findById(decoded._id);
    if (!user) {
        (0, errorHandler_1.errorMessage)(res, 400, "Please login to access this recourse");
    }
    res.locals.user = user;
    next();
});
const authorizeUser = (...roles) => {
    return (0, express_async_handler_1.default)(async (req, res, next) => {
        if (!roles.includes(res.locals.user.role)) {
            (0, errorHandler_1.errorMessage)(res, 403, `${res.locals.user.role} is not allowed to access this recourse`);
        }
        next();
    });
};
exports.authorizeUser = authorizeUser;
//# sourceMappingURL=authGard.js.map