import express from "express";
import { createProduct } from "../controllers/product.controller";
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

export default productRoute;
