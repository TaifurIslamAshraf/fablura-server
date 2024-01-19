"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordService = exports.activationUserService = exports.registerUserService = void 0;
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const secret_1 = __importDefault(require("../config/secret"));
const activationToken_1 = require("../lib/activationToken");
const errorHandler_1 = require("../lib/errorHandler");
const genarateJwtToken_1 = require("../lib/genarateJwtToken");
const sendMail_1 = require("../lib/sendMail");
const user_model_1 = __importDefault(require("../models/user.model"));
const registerUserService = async (activationMailData, res) => {
    const { token, activationCode } = (0, activationToken_1.createActivationToken)(activationMailData);
    const data = {
        user: { name: activationMailData.fullName },
        activationCode: activationCode,
    };
    const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "/../views/mail.ejs"), data);
    try {
        await (0, sendMail_1.sendMails)({
            email: activationMailData.email,
            subject: "Activate your account",
            templete: "mail.ejs",
            data,
        });
        res.status(200).json({
            success: true,
            message: `Please check your email: ${activationMailData.email} to activate your account`,
            activationToken: token,
        });
    }
    catch (error) {
        (0, errorHandler_1.errorMessage)(res, 400, error.message);
    }
};
exports.registerUserService = registerUserService;
const activationUserService = async (newUser, res) => {
    //user data save in database
    const { fullName, email, password, avatar, phone, address, isSocialAuth } = newUser;
    const isEmailExist = await user_model_1.default.exists({ email });
    if (isEmailExist) {
        (0, errorHandler_1.errorMessage)(res, 400, "Email Alredy Exist");
    }
    const user = await user_model_1.default.create({
        fullName,
        email,
        password,
        avatar,
        phone,
        address,
        isSocialAuth,
    });
    return user;
};
exports.activationUserService = activationUserService;
const forgotPasswordService = async (userId, email) => {
    const serverUrl = secret_1.default.serverUrl;
    const forgotPasswordToken = (0, genarateJwtToken_1.genarateJwtToken)({
        payload: { _id: userId },
        jwtSecret: secret_1.default.forgotPasswordSecret,
        expireIn: "5m",
    });
    const forgotPasswordLink = `${serverUrl}/api/v1/user/forgot-password-link-validation/${userId}/${forgotPasswordToken}`;
    await ejs_1.default.renderFile(path_1.default.join(__dirname, "/../views/forgotMail.ejs"), {
        forgotPasswordLink,
    });
    await (0, sendMail_1.sendMails)({
        email: email,
        subject: "Reset Your MyShop password",
        templete: "forgotMail.ejs",
        data: { forgotPasswordLink },
    });
};
exports.forgotPasswordService = forgotPasswordService;
//# sourceMappingURL=user.services.js.map