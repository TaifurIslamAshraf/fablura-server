import express from "express";
import { createOrder } from "../controllers/order.controller";
import { validator } from "../middlewares/validator";
import { createOrderSchema } from "../validators/order.schema";

const orderRoute = express.Router();

orderRoute.post("/create-order", validator(createOrderSchema), createOrder);

export default orderRoute;
