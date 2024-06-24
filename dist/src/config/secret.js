"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = {
    serverUrl: process.env.SERVER_URL,
    clientUrl: process.env.CLIENT_URL,
    origins: process.env.ORIGINS,
    PORT: process.env.PORT,
    dbUri: process.env.DB_URI,
    forgotPasswordSecret: process.env.FORGOT_PASSWORD_SECRET,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    mailVarificationTokenSecret: process.env
        .MAIL_VARIFICATION_TOKEN_SECRET,
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE,
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE,
    smtpMail: process.env.SMTP_MAIL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpService: process.env.SMTP_SERVICE,
    smtpPass: process.env.SMTP_PASS,
};
exports.default = secret;
//# sourceMappingURL=secret.js.map