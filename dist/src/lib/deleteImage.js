"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultipleImages = exports.deleteImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteImage = async (filePath) => {
    if (!filePath)
        return;
    const imagePath = path_1.default.join(process.cwd(), filePath);
    return new Promise((resolve, reject) => {
        fs_1.default.unlink(imagePath, (err) => {
            if (err) {
                if (err.code === "ENOENT") {
                    console.log(`File not found: ${imagePath}`);
                    resolve(); // Resolve even if file is not found
                }
                else {
                    console.error(`Error deleting file: ${imagePath}`, err);
                    reject(err);
                }
            }
            else {
                console.log(`Successfully deleted file: ${imagePath}`);
                resolve();
            }
        });
    });
};
exports.deleteImage = deleteImage;
const deleteMultipleImages = async (filePaths) => {
    if (filePaths.length === 0)
        return;
    const deletePromises = filePaths.map(filePath => (0, exports.deleteImage)(filePath));
    try {
        await Promise.all(deletePromises);
    }
    catch (error) {
        console.error("Error deleting multiple images:", error);
        throw error; // Rethrow the error if you want to handle it in the calling function
    }
};
exports.deleteMultipleImages = deleteMultipleImages;
//# sourceMappingURL=deleteImage.js.map