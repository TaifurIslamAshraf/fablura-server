"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMails = void 0;
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const secret_1 = __importDefault(require("../config/secret"));
const sendMails = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        port: Number(secret_1.default.smtpPort),
        host: secret_1.default.smtpHost,
        service: secret_1.default.smtpService,
        auth: {
            user: secret_1.default.smtpMail,
            pass: secret_1.default.smtpPass,
        },
    });
    const { email, subject, templete, data } = options;
    const templetePath = path_1.default.join(__dirname, "../views", templete);
    //render the mail templete with ejs
    const html = await ejs_1.default.renderFile(templetePath, data);
    const mailOptions = {
        from: secret_1.default.smtpMail,
        to: email,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendMails = sendMails;
//# sourceMappingURL=sendMail.js.map