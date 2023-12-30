"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwtToken = (token, secret) => {
    const result = jsonwebtoken_1.default.verify(token, secret);
    return result;
};
exports.verifyJwtToken = verifyJwtToken;
//# sourceMappingURL=verifyToken.js.map