"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultipleImages = exports.deleteImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteImage = async (filePath) => {
    if (filePath) {
        return new Promise((resolve, reject) => {
            const imagePath = path_1.default.join(__dirname, "..", "..", "..", filePath.replace(/\\/g, "/"));
            fs_1.default.unlink(imagePath, (err) => {
                if (err) {
                    if (err.code === "ENOENT") {
                        console.log("File not found");
                    }
                    else {
                        console.log(`Error Deleting file: ${filePath}`, err);
                    }
                }
            });
            resolve({});
        });
    }
};
exports.deleteImage = deleteImage;
const deleteMultipleImages = async (filePaths) => {
    if (filePaths.length > 0) {
        const unlinkPromises = [];
        filePaths.map((file) => {
            const unlinkPromise = new Promise((resolve) => {
                const filePath = path_1.default.join(__dirname, "..", "..", "..", file.replace(/\\/g, "/"));
                console.log(filePath);
                fs_1.default.unlink(filePath, (err) => {
                    if (err && err.code === "ENOENT") {
                        console.log(`File not found ${file}`);
                    }
                    else if (err) {
                        console.error(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
            unlinkPromises.push(unlinkPromise);
        });
        await Promise.all(unlinkPromises);
    }
};
exports.deleteMultipleImages = deleteMultipleImages;
//# sourceMappingURL=deleteImage.js.map