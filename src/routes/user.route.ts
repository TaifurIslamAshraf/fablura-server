import express from "express";

import {
  activateUser,
  deleteUser,
  forgotPassword,
  forgotPasswordLinkValidation,
  getAllUsers,
  getUserInfo,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";
import { validator } from "../middlewares/validator";
import {
  activateUserSchema,
  loginUserSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserRoleSchema,
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
userRoute.put(
  "/update-password",
  isAuthenticated,
  validator(updatePasswordSchema),
  updatePassword
);
userRoute.post("/forgot-password", forgotPassword);
userRoute.get(
  "/reset-password-link-validation/:userId/:token",
  forgotPasswordLinkValidation
);
userRoute.put("/reset-password", validator(resetPasswordSchema), resetPassword);
userRoute.get(
  "/all-users",
  isAuthenticated,
  authorizeUser("admin"),
  getAllUsers
);
userRoute.put(
  "/update-role",
  validator(updateUserRoleSchema),
  isAuthenticated,
  authorizeUser("admin"),
  updateUserRole
);
userRoute.delete(
  "/delete-user/:userId",
  isAuthenticated,
  authorizeUser("admin"),
  deleteUser
);

export default userRoute;
