"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const deleteImage = async (filePath) => {
    if (filePath) {
        await promises_1.default.unlink(filePath);
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=deleteImage.js.map