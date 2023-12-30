"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genarateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genarateJwtToken = ({ payload, jwtSecret, expireIn, }) => {
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: expireIn });
    return token;
};
exports.genarateJwtToken = genarateJwtToken;
//# sourceMappingURL=genarateJwtToken.js.map