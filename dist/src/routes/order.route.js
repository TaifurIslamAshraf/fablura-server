"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const authGard_1 = require("../middlewares/authGard");
const validator_1 = require("../middlewares/validator");
const order_schema_1 = require("../validators/order.schema");
const orderRoute = express_1.default.Router();
orderRoute.post("/create-order", (0, validator_1.validator)(order_schema_1.createOrderSchema), order_controller_1.createOrder);
orderRoute.get("/single-order/:id", order_controller_1.getSignleOrder);
orderRoute.get("/user-orders", order_controller_1.getUserOrders);
orderRoute.put("/update-order-status/:id", (0, validator_1.validator)(order_schema_1.updateOrderStatusSchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), order_controller_1.updateOrderStatus);
orderRoute.get("/all-orders", authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), order_controller_1.getAllOrders);
orderRoute.delete("/delete-order/:id", (0, validator_1.validator)(order_schema_1.deleteOrderSchema), authGard_1.isAuthenticated, (0, authGard_1.authorizeUser)("admin"), order_controller_1.deleteOrders);
exports.default = orderRoute;
//# sourceMappingURL=order.route.js.map