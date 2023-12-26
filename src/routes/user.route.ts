import express from "express";

import {
  activateUser,
  loginUser,
  logout,
  registerUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/authGard";
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

export default userRoute;
