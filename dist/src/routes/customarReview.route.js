"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customarReview_controller_1 = require("../controllers/customarReview.controller");
const authGard_1 = require("../middlewares/authGard");
const uploadFile_1 = require("../middlewares/uploadFile");
const customerReviewRoute = express_1.default.Router();
customerReviewRoute.post("/create-customer-review", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), (0, uploadFile_1.fileUploder)("public/uploads/customerReview", true, "image"), customarReview_controller_1.createCustomerReview);
customerReviewRoute.get("/get-customer-review", customarReview_controller_1.getAllCustomerReview);
customerReviewRoute.delete("/delete-customer-review/:id", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), customarReview_controller_1.deleteCustomerReview);
exports.default = customerReviewRoute;
//# sourceMappingURL=customarReview.route.js.map