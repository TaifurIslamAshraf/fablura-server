"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authGard_1 = require("../middlewares/authGard");
const uploadFile_1 = require("../middlewares/uploadFile");
const validator_1 = require("../middlewares/validator");
const user_schema_1 = require("../validators/user.schema");
const userRoute = express_1.default.Router();
const upload = (0, uploadFile_1.fileUploder)("public/uploads/users");
userRoute.post("/register", (0, validator_1.validator)(user_schema_1.userSchemaValidator), user_controller_1.registerUser);
userRoute.post("/activate", (0, validator_1.validator)(user_schema_1.activateUserSchema), user_controller_1.activateUser);
userRoute.post("/login", (0, validator_1.validator)(user_schema_1.loginUserSchema), user_controller_1.loginUser);
userRoute.get("/logout", authGard_1.isAuthenticated, user_controller_1.logout);
userRoute.get("/refresh", user_controller_1.updateAccessToken);
userRoute.get("/me", authGard_1.isAuthenticated, user_controller_1.getUserInfo);
userRoute.get("/social-auth", user_controller_1.socialAuth);
userRoute.put("/update-info", authGard_1.isAuthenticated, upload.single("avatar"), user_controller_1.updateUserInfo);
exports.default = userRoute;
//# sourceMappingURL=user.route.js.map