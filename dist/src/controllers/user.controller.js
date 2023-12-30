"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logout = exports.loginUser = exports.activateUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const secret_1 = __importDefault(require("../config/secret"));
const deleteImage_1 = require("../lib/deleteImage");
const errorHandler_1 = require("../lib/errorHandler");
const genarateJwtToken_1 = require("../lib/genarateJwtToken");
const jwt_1 = require("../lib/jwt");
const verifyToken_1 = require("../lib/verifyToken");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_services_1 = require("../services/user.services");
//register user
exports.registerUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    //get user data form body
    const { fullName, email, password, avatar, address, phone } = req.body;
    //is Email exist
    const user = await user_model_1.default.findOne({ email: email });
    if (user) {
        (0, errorHandler_1.errorMessage)(res, 400, "User Alredy exist");
    }
    if (user?.isSocialAuth) {
        (0, errorHandler_1.errorMessage)(res, 400, "You are alredy sign in with google");
    }
    const mailData = {
        fullName,
        email,
        password,
        isSocialAuth: false,
        avatar,
        address,
        phone,
    };
    await (0, user_services_1.registerUserService)(mailData, res);
});
//activate user
exports.activateUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { token, activation_code } = req.body;
    //veryfy token and get user info
    const newUser = (0, verifyToken_1.verifyJwtToken)(token, secret_1.default.mailVarificationTokenSecret);
    if (newUser.activationCode !== activation_code) {
        (0, errorHandler_1.errorMessage)(res, 400, "Invalid Activation Code.");
    }
    const user = await (0, user_services_1.activationUserService)(newUser.user, res);
    res.status(200).json({
        success: true,
        message: "User Registration successfully",
        user,
    });
});
//login user
exports.loginUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next((0, errorHandler_1.errorMessage)(res, 400, "Invalid email or password"));
    }
    if (user?.isSocialAuth) {
        (0, errorHandler_1.errorMessage)(res, 400, "You are alredy signin with google");
    }
    const isPasswordMatch = await user?.comparePassword(password);
    if (!isPasswordMatch) {
        return next((0, errorHandler_1.errorMessage)(res, 400, "Invalid email or password"));
    }
    const resUser = await user_model_1.default.findOne({ email });
    (0, jwt_1.sendToken)(resUser, 200, res);
});
//logout user
exports.logout = (0, express_async_handler_1.default)(async (req, res, next) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({
        success: true,
        message: "Logout successfull",
    });
});
//update access token
exports.updateAccessToken = (0, express_async_handler_1.default)(async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;
    const decoded = (0, verifyToken_1.verifyJwtToken)(refresh_token, secret_1.default.refreshTokenSecret);
    if (!decoded) {
        (0, errorHandler_1.errorMessage)(res, 400, "Please login to access this recourse");
    }
    const userId = decoded._id;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        (0, errorHandler_1.errorMessage)(res, 400, "Please login to access this recourse");
    }
    const accessToken = (0, genarateJwtToken_1.genarateJwtToken)({
        payload: { _id: userId },
        jwtSecret: secret_1.default.accessTokenSecret,
        expireIn: "5m",
    });
    const refreshToken = (0, genarateJwtToken_1.genarateJwtToken)({
        payload: { _id: userId },
        jwtSecret: secret_1.default.refreshTokenSecret,
        expireIn: "30d",
    });
    res.locals.user = user;
    res.cookie("access_token", accessToken, jwt_1.accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenCookieOptions);
    res.status(200).json({
        success: true,
        accessToken,
    });
});
exports.getUserInfo = (0, express_async_handler_1.default)(async (req, res, next) => {
    const userId = res.locals.user._id;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        (0, errorHandler_1.errorMessage)(res, 404, "User not found");
    }
    console.log(user?.avatar);
    res.status(200).json({
        success: true,
        user,
    });
});
exports.socialAuth = (0, express_async_handler_1.default)(async (req, res) => {
    const { fullName, email, avatar } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        const newUser = await user_model_1.default.create({
            fullName,
            email,
            avatar,
            isSocialAuth: true,
        });
        (0, jwt_1.sendToken)(newUser, 201, res);
    }
    else {
        (0, jwt_1.sendToken)(user, 200, res);
    }
});
exports.updateUserInfo = (0, express_async_handler_1.default)(async (req, res) => {
    const { fullName, phone, address } = req.body;
    if (req.body.email) {
        (0, errorHandler_1.errorMessage)(res, 400, "You can not update you email");
    }
    const userId = res.locals.user._id;
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        (0, errorHandler_1.errorMessage)(res, 404, "User not found");
    }
    if (req.file) {
        await (0, deleteImage_1.deleteImage)(user?.avatar);
    }
    let updateFields = {};
    if (fullName) {
        updateFields.fullName = fullName;
    }
    if (phone) {
        updateFields.phone = phone;
    }
    if (address) {
        updateFields.address = address;
    }
    if (req.file?.path) {
        updateFields.avatar = req.file.path;
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });
    if (!updatedUser) {
        (0, errorHandler_1.errorMessage)(res, 404, "User not found");
        return;
    }
    res.status(200).json({
        success: true,
        message: "User info update successfull",
        updatedUser,
    });
});
//# sourceMappingURL=user.controller.js.map