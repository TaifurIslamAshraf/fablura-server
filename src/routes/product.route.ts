import express from "express";
import { createProduct } from "../controllers/product.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";

const productRoute = express.Router();

productRoute.post(
  "/create-product",
  isAuthenticated,
  authorizeUser("admin"),
  createProduct
);

export default productRoute;
