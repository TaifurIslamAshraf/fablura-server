"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const banner_controller_1 = require("../controllers/banner.controller");
const authGard_1 = require("../middlewares/authGard");
const uploadFile_1 = require("../middlewares/uploadFile");
const bannerRoute = express_1.default.Router();
bannerRoute.post("/create-banner", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), (0, uploadFile_1.fileUploder)("public/uploads/banners", true, "image"), banner_controller_1.createBanner);
bannerRoute.get("/get-all-banners", banner_controller_1.getAllBanners);
bannerRoute.get("/get-single-banner/:id", banner_controller_1.getSingleBanners);
bannerRoute.delete("/delete-banner/:id", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), banner_controller_1.deleteBanners);
exports.default = bannerRoute;
//# sourceMappingURL=banner.route.js.map