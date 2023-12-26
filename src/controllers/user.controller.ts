import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IActivationInfo, IUser } from "../../types/user";
import secret from "../config/secret";
import { errorMessage } from "../lib/errorHandler";
import { sendToken } from "../lib/jwt";
import { verifyJwtToken } from "../lib/verifyToken";
import UserModel from "../models/user.model";
import {
  activationUserService,
  registerUserService,
} from "../services/user.services";

//register user
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

    const mailData = {
      fullName,
      email,
      password,
      isSocialAuth: false,
      avatar,
      address,
      phone,
    };

    await registerUserService(mailData, res);
  }
);

//activate user
export const activateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, activation_code } = req.body;

    //veryfy token and get user info
    const newUser: { user: IActivationInfo; activationCode: string } =
      verifyJwtToken(token, secret.mailVarificationTokenSecret) as {
        user: IActivationInfo;
        activationCode: string;
      };

    if (newUser.activationCode !== activation_code) {
      errorMessage(res, 400, "Invalid Activation Code.");
    }

    const user = await activationUserService(newUser.user, res);

    res.status(200).json({
      success: true,
      message: "User Registration successfully",
      user,
    });
  }
);

//login user
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(errorMessage(res, 400, "Invalid email or password"));
    }

    if (user?.isSocialAuth) {
      errorMessage(res, 400, "You are alredy signin with google");
    }

    const isPasswordMatch = await user?.comparePassword(password);
    if (!isPasswordMatch) {
      return next(errorMessage(res, 400, "Invalid email or password"));
    }

    const resUser = await UserModel.findOne({ email });

    sendToken(resUser, 200, res);
  }
);

//logout user
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({
      success: true,
      message: "Logout successfull",
    });
  }
);
