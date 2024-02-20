"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bannerSchema = new mongoose_1.default.Schema({
    bannerType: {
        type: String,
        enum: ["topBanner", "mainBanner", "categoryBanner"],
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
    },
    image: {
        type: String,
        required: true,
    },
});
const BannerModel = mongoose_1.default.model("Banner", bannerSchema);
exports.default = BannerModel;
//# sourceMappingURL=banner.model.js.map