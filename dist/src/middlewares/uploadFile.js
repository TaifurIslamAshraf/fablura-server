"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploder = void 0;
const multer_1 = __importDefault(require("multer"));
const fileUploder = (destinations) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinations);
        },
        filename: (req, file, cb) => {
            const name = Date.now() + "-" + file.originalname;
            cb(null, name);
        },
    });
    return (0, multer_1.default)({ storage: storage });
};
exports.fileUploder = fileUploder;
//# sourceMappingURL=uploadFile.js.map