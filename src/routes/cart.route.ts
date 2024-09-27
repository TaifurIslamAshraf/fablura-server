import express from "express";
import {
  addCartItem,
  calculatePrice,
  getCartItem,
  syncCart,
} from "../controllers/cart.controller";
import { validator } from "../middlewares/validator";
import { addToCartSchema } from "../validators/cart.schema";

const cartRoute = express.Router();

cartRoute.post("/add-to-cart", validator(addToCartSchema), addCartItem);
cartRoute.post("/cart-sync", syncCart);
cartRoute.get("/get-cart", getCartItem);
cartRoute.get("/updated-price", calculatePrice);

export default cartRoute;
