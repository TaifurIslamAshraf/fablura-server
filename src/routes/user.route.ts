import express from "express";

import {
  activateUser,
  getUserInfo,
  loginUser,
  logout,
  registerUser,
  socialAuth,
  updateAccessToken,
  updateUserInfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";
import { validator } from "../middlewares/validator";
import {
  activateUserSchema,
  loginUserSchema,
  userSchemaValidator,
} from "../validators/user.schema";

const userRoute = express.Router();

userRoute.post("/register", validator(userSchemaValidator), registerUser);
userRoute.post("/activate", validator(activateUserSchema), activateUser);
userRoute.post("/login", validator(loginUserSchema), loginUser);
userRoute.get("/logout", isAuthenticated, logout);
userRoute.get("/refresh", updateAccessToken);
userRoute.get("/me", isAuthenticated, getUserInfo);
userRoute.get("/social-auth", socialAuth);
userRoute.put(
  "/update-info",
  isAuthenticated,
  fileUploder("public/uploads/users", true, "avatar"),
  updateUserInfo
);

export default userRoute;
