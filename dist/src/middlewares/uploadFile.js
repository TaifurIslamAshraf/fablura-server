"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploder = void 0;
const multer_1 = __importDefault(require("multer"));
const fileUploder = (destinations, singleUpload, fieldName) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinations);
        },
        filename: (req, file, cb) => {
            const originalName = file.originalname.replace(/\s+/g, "-");
            const name = Date.now() + "-" + originalName;
            cb(null, name);
        },
    });
    const fileFilters = async (req, file, cb) => {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/webp" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
        }
    };
    const upload = singleUpload
        ? (0, multer_1.default)({
            fileFilter: fileFilters,
            storage: storage,
            limits: { fileSize: 1024 * 1024 * 5 },
        }).single(fieldName)
        : (0, multer_1.default)({
            fileFilter: fileFilters,
            storage: storage,
            limits: { fileSize: 1024 * 1024 * 40 },
        }).array(fieldName, 5);
    return upload;
};
exports.fileUploder = fileUploder;
//# sourceMappingURL=uploadFile.js.map