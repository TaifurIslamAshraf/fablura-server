import express from "express";
import { addCartItem, syncCart } from "../controllers/cart.controller";

const cartRoute = express.Router();

cartRoute.post("/add-to-cart", addCartItem);
cartRoute.post("/cart-sync", syncCart);

export default cartRoute;
