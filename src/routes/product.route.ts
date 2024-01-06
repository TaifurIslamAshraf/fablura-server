import express from "express";
import {
  createProduct,
  createReviews,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getProductReviews,
  getSingleProduct,
  updateProduct,
  updateReviewStatus,
} from "../controllers/product.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";
import { validator } from "../middlewares/validator";
import {
  CreateProductReviewSchema,
  ProductFilterSchema,
  UpdateProductReviewSchema,
} from "../validators/product.schema";

const productRoute = express.Router();

productRoute.post(
  "/create-product",
  // validator(ProductSchema),
  isAuthenticated,
  authorizeUser("admin"),
  fileUploder("public/uploads/products", false, "images"),
  createProduct
);
productRoute.put(
  "/update-product",
  isAuthenticated,
  authorizeUser("admin"),
  fileUploder("public/uploads/products", false, "images"),
  updateProduct
);

productRoute.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteProduct
);

productRoute.get("/single-product/:slug", getSingleProduct);
productRoute.get(
  "/all-products",
  validator(ProductFilterSchema),
  getAllProducts
);
productRoute.put(
  "/create-review",
  validator(CreateProductReviewSchema),
  isAuthenticated,
  createReviews
);
productRoute.put(
  "/update-review-status",
  validator(UpdateProductReviewSchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateReviewStatus
);
productRoute.delete(
  "/delete-review/:productId/:reviewId",
  isAuthenticated,
  authorizeUser("admin"),
  deleteReview
);
productRoute.get("/all-reviews", getProductReviews);

export default productRoute;
