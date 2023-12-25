import express from "express";
import { registerUser } from "../controllers/user.controller";
import { validator } from "../middlewares/validator";
import { userSchemaValidator } from "../validators/user.schema";

const userRoute = express.Router();

userRoute.post("/register", validator(userSchemaValidator), registerUser);

export default userRoute;
