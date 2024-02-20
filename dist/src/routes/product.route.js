"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const authGard_1 = require("../middlewares/authGard");
const uploadFile_1 = require("../middlewares/uploadFile");
const validator_1 = require("../middlewares/validator");
const product_schema_1 = require("../validators/product.schema");
const productRoute = express_1.default.Router();
productRoute.post("/create-product", 
// validator(ProductSchema),
authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), (0, uploadFile_1.fileUploder)("public/uploads/products", false, "images"), product_controller_1.createProduct);
productRoute.put("/update-product", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), (0, uploadFile_1.fileUploder)("public/uploads/products", false, "images"), product_controller_1.updateProduct);
productRoute.delete("/delete-product/:id", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), product_controller_1.deleteProduct);
productRoute.get("/single-product/:slug", product_controller_1.getSingleProduct);
productRoute.get("/all-products", (0, validator_1.validator)(product_schema_1.ProductFilterSchema), product_controller_1.getAllProducts);
productRoute.get("/sold-product", product_controller_1.getResentSoldProducts);
productRoute.put("/create-review", (0, validator_1.validator)(product_schema_1.CreateProductReviewSchema), authGard_1.isAuthenticated, product_controller_1.createReviews);
productRoute.put("/update-review-status", (0, validator_1.validator)(product_schema_1.UpdateProductReviewSchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), product_controller_1.updateReviewStatus);
productRoute.delete("/delete-review", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), product_controller_1.deleteReview);
productRoute.get("/all-product-reviews", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), product_controller_1.getAllProductsReviews);
productRoute.get("/all-reviews", product_controller_1.getProductReviews);
productRoute.get("/cart-products", product_controller_1.cartProducts);
productRoute.get("/stock-status", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), product_controller_1.getStockStatus);
exports.default = productRoute;
//# sourceMappingURL=product.route.js.map