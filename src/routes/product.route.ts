import express from "express";
import {
  cartProducts,
  createProduct,
  createReviews,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllProductsReviews,
  getProductReviews,
  getResentSoldProducts,
  getSingleProduct,
  getStockStatus,
  updateProduct,
  updateReviewStatus,
} from "../controllers/product.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";
import { validator } from "../middlewares/validator";
import {ProductSchema} from "../validators/product.schema"
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
productRoute.get("/sold-product", getResentSoldProducts);
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
  "/delete-review",
  isAuthenticated,
  authorizeUser("admin"),
  deleteReview
);
productRoute.get(
  "/all-product-reviews",
  isAuthenticated,
  authorizeUser("admin"),
  getAllProductsReviews
);
productRoute.get("/all-reviews", getProductReviews);
productRoute.get("/cart-products", cartProducts);
productRoute.get(
  "/stock-status",
  isAuthenticated,
  authorizeUser("admin"),
  getStockStatus
);

export default productRoute;
