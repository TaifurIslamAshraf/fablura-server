"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const validator_1 = require("../middlewares/validator");
const cart_schema_1 = require("../validators/cart.schema");
const cartRoute = express_1.default.Router();
cartRoute.post("/add-to-cart", (0, validator_1.validator)(cart_schema_1.addToCartSchema), cart_controller_1.addCartItem);
cartRoute.post("/cart-sync", cart_controller_1.syncCart);
cartRoute.get("/get-cart", cart_controller_1.getCartItem);
cartRoute.get("/updated-price", cart_controller_1.calculatePrice);
exports.default = cartRoute;
//# sourceMappingURL=cart.route.js.map