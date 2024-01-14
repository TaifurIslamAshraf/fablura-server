import express from "express";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategory,
  getAllCategoryAndSubCategory,
  getAllSubCategory,
  getSignleCategory,
  getSignleSubCategory,
  updateCategory,
  updateSubCategory,
} from "../controllers/category.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { validator } from "../middlewares/validator";
import {
  createCategorySchema,
  createSubCategorySchema,
  getSingleCategorySchema,
  updateCategorySchema,
} from "../validators/category.schema";

export const categoryRoute = express.Router();

// get all category and subcategory
categoryRoute.get("/category-subcategory", getAllCategoryAndSubCategory);

categoryRoute.post(
  "/create-category",
  validator(createCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  createCategory
);
categoryRoute.get("/get-all-category", getAllCategory);
categoryRoute.get(
  "/get-single-category/:slug",
  validator(getSingleCategorySchema),
  getSignleCategory
);
categoryRoute.put(
  "/update-category",
  validator(updateCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateCategory
);
categoryRoute.delete(
  "/delete-category/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteCategory
);

// sub category
export const subcategoryRoute = express.Router();

subcategoryRoute.post(
  "/create-subcategory",
  validator(createSubCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  createSubCategory
);
subcategoryRoute.get("/get-all-subcategory", getAllSubCategory);
subcategoryRoute.get(
  "/get-single-subcategory/:slug",
  validator(getSingleCategorySchema),
  getSignleSubCategory
);
subcategoryRoute.put(
  "/update-subcategory",
  validator(updateCategorySchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateSubCategory
);
subcategoryRoute.delete(
  "/delete-subcategory/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteSubCategory
);
