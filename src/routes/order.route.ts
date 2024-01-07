import express from "express";
import {
  createOrder,
  getSignleOrder,
  getUserOrders,
} from "../controllers/order.controller";
import { validator } from "../middlewares/validator";
import { createOrderSchema } from "../validators/order.schema";

const orderRoute = express.Router();

orderRoute.post("/create-order", validator(createOrderSchema), createOrder);
orderRoute.get("/single-order/:id", getSignleOrder);
orderRoute.get("/user-orders", getUserOrders);

export default orderRoute;
