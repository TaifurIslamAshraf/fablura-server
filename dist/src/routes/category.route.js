"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcategoryRoute = exports.categoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authGard_1 = require("../middlewares/authGard");
const validator_1 = require("../middlewares/validator");
const category_schema_1 = require("../validators/category.schema");
exports.categoryRoute = express_1.default.Router();
// get all category and subcategory
exports.categoryRoute.get("/category-subcategory", category_controller_1.getAllCategoryAndSubCategory);
exports.categoryRoute.post("/create-category", (0, validator_1.validator)(category_schema_1.createCategorySchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), category_controller_1.createCategory);
exports.categoryRoute.get("/get-all-category", category_controller_1.getAllCategory);
exports.categoryRoute.get("/get-single-category/:slug", (0, validator_1.validator)(category_schema_1.getSingleCategorySchema), category_controller_1.getSignleCategory);
exports.categoryRoute.put("/update-category", (0, validator_1.validator)(category_schema_1.updateCategorySchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), category_controller_1.updateCategory);
exports.categoryRoute.delete("/delete-category/:id", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), category_controller_1.deleteCategory);
// sub category
exports.subcategoryRoute = express_1.default.Router();
exports.subcategoryRoute.post("/create-subcategory", (0, validator_1.validator)(category_schema_1.createSubCategorySchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), category_controller_1.createSubCategory);
exports.subcategoryRoute.get("/get-all-subcategory", category_controller_1.getAllSubCategory);
exports.subcategoryRoute.get("/get-single-subcategory/:slug", (0, validator_1.validator)(category_schema_1.getSingleCategorySchema), category_controller_1.getSignleSubCategory);
exports.subcategoryRoute.put("/update-subcategory", (0, validator_1.validator)(category_schema_1.updateCategorySchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), category_controller_1.updateSubCategory);
exports.subcategoryRoute.delete("/delete-subcategory/:id", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), category_controller_1.deleteSubCategory);
//# sourceMappingURL=category.route.js.map