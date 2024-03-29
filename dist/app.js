"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const ejs_1 = __importDefault(require("ejs"));
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./src/lib/errorHandler");
const banner_route_1 = __importDefault(require("./src/routes/banner.route"));
const cart_route_1 = __importDefault(require("./src/routes/cart.route"));
const category_route_1 = require("./src/routes/category.route");
const customarReview_route_1 = __importDefault(require("./src/routes/customarReview.route"));
const order_route_1 = __importDefault(require("./src/routes/order.route"));
const product_route_1 = __importDefault(require("./src/routes/product.route"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
exports.app = (0, express_1.default)();
//logger
const accessLogStream = (0, fs_1.createWriteStream)(path_1.default.join(__dirname, "access.log"), {
    flags: "a",
});
exports.app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
exports.app.use((0, morgan_1.default)("dev"));
//static folder location
exports.app.use("/public", express_1.default.static("public"));
//set view engine to ejs
exports.app.set("view engine", ejs_1.default);
//body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
//cookie-parser
exports.app.use((0, cookie_parser_1.default)());
//alowed origin
const origin = [
    "https://my-shop-client-tawny.vercel.app",
    "http://localhost:3000",
    "https://my-shop-client-git-next-auth-version-taifurislamashraf.vercel.app",
];
//cors setup
exports.app.use((0, cors_1.default)({
    origin: origin,
    credentials: true,
}));
//all routes here
exports.app.use("/api/v1/user", user_route_1.default);
exports.app.use("/api/v1/category", category_route_1.categoryRoute);
exports.app.use("/api/v1/subcategory", category_route_1.subcategoryRoute);
exports.app.use("/api/v1/banner", banner_route_1.default);
exports.app.use("/api/v1/product", product_route_1.default);
exports.app.use("/api/v1/order", order_route_1.default);
exports.app.use("/api/v1/review", customarReview_route_1.default);
exports.app.use("/api/v1/cart", cart_route_1.default);
//test route
exports.app.get("/", (0, express_async_handler_1.default)(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Test successfully new",
        data: "This is Test Data",
    });
}));
//error handling
exports.app.use(errorHandler_1.notFound);
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map