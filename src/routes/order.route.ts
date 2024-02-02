import express from "express";
import {
  createOrder,
  deleteOrders,
  getAllOrders,
  getOrderStatus,
  getSealesReport,
  getSignleOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { validator } from "../middlewares/validator";
import {
  createOrderSchema,
  deleteOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.schema";

const orderRoute = express.Router();

orderRoute.post("/create-order", validator(createOrderSchema), createOrder);
orderRoute.get("/single-order/:id", getSignleOrder);
orderRoute.get("/user-orders", getUserOrders);
orderRoute.put(
  "/update-order-status/:id",
  validator(updateOrderStatusSchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateOrderStatus
);
orderRoute.get(
  "/all-orders",
  isAuthenticated,
  authorizeUser("admin"),
  getAllOrders
);
orderRoute.delete(
  "/delete-order/:id",
  validator(deleteOrderSchema),
  isAuthenticated,
  authorizeUser("admin"),
  deleteOrders
);

//chart
orderRoute.get(
  "/monthly-sales",
  isAuthenticated,
  authorizeUser("admin"),
  getSealesReport
);
orderRoute.get(
  "/order-status",
  isAuthenticated,
  authorizeUser("admin"),
  getOrderStatus
);

export default orderRoute;
