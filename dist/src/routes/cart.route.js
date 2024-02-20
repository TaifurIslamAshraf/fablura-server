"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const cartRoute = express_1.default.Router();
cartRoute.post("/add-to-cart", cart_controller_1.addCartItem);
cartRoute.post("/cart-sync", cart_controller_1.syncCart);
cartRoute.get("/get-cart", cart_controller_1.getCartItem);
cartRoute.get("/updated-price", cart_controller_1.calculatePrice);
exports.default = cartRoute;
//# sourceMappingURL=cart.route.js.map