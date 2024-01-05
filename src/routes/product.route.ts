import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";

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
productRoute.get("/all-products/", getAllProducts);

export default productRoute;
