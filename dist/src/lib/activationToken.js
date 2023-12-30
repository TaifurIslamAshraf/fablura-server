"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivationToken = void 0;
const secret_1 = __importDefault(require("../config/secret"));
const genarateJwtToken_1 = require("./genarateJwtToken");
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = (0, genarateJwtToken_1.genarateJwtToken)({
        payload: { user, activationCode },
        jwtSecret: secret_1.default.mailVarificationTokenSecret,
        expireIn: "5m",
    });
    return { activationCode, token };
};
exports.createActivationToken = createActivationToken;
//# sourceMappingURL=activationToken.js.map