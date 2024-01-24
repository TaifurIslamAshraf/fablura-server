import express from "express";
import {
  addCartItem,
  getCartItem,
  syncCart,
} from "../controllers/cart.controller";

const cartRoute = express.Router();

cartRoute.post("/add-to-cart", addCartItem);
cartRoute.post("/cart-sync", syncCart);
cartRoute.get("/get-cart", getCartItem);

export default cartRoute;
