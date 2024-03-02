"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenCookieOptions = exports.accessTokenCookieOptions = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const secret_1 = __importDefault(require("../config/secret"));
dotenv_1.default.config();
//parse env value to inregate with falback value
const accessTokenExpire = parseInt(secret_1.default.accessTokenExpire || "1", 10);
const refreshTokenExpire = parseInt(secret_1.default.refreshTokenExpire || "1", 10);
//options for cookis
exports.accessTokenCookieOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};
exports.refreshTokenCookieOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};
const sendToken = (user, statusCode, res) => {
    const accessToken = user.accessToken();
    const refreshToken = user.refreshToken();
    const expireTime = accessTokenExpire * 60 * 1000;
    // res.cookie("access_token", accessToken, accessTokenCookieOptions);
    // res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.locals.user = user;
    res.status(200).json({
        success: true,
        message: "User login successfully",
        user,
        accessToken,
        refreshToken,
        expireIn: new Date().setTime(new Date().getTime() + expireTime),
    });
};
exports.sendToken = sendToken;
//# sourceMappingURL=jwt.js.map