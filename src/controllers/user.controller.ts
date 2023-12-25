import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser } from "../../types/user";
import { errorMessage } from "../lib/errorHandler";
import UserModel from "../models/user.model";

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get user data form body
    const { fullName, email, password, avatar, address, phone } =
      req.body as IUser;

    //is Email exist
    const user = await UserModel.findOne({ email: email });
    if (user) {
      errorMessage(res, 400, "User Alredy exist");
    }
    if (user?.isSocialAuth) {
      errorMessage(res, 400, "You are alredy sign in with google");
    }

    const newUser = await UserModel.create({
      fullName,
      email,
      password,
      avatar,
      address,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User is created successfully",
      user: newUser,
    });
  }
);
