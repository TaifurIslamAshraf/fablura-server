import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { JwtPayload } from "jsonwebtoken";
import { IActivationInfo, IUser } from "../../types/user";
import secret from "../config/secret";
import { errorMessage } from "../lib/errorHandler";
import { genarateJwtToken } from "../lib/genarateJwtToken";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  sendToken,
} from "../lib/jwt";
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

//update access token
export const updateAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token as string;

    const decoded = verifyJwtToken(
      refresh_token,
      secret.refreshTokenSecret
    ) as JwtPayload;
    if (!decoded) {
      errorMessage(res, 400, "Please login to access this recourse");
    }

    const userId = decoded._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      errorMessage(res, 400, "Please login to access this recourse");
    }

    const accessToken = genarateJwtToken({
      payload: { _id: userId },
      jwtSecret: secret.accessTokenSecret,
      expireIn: "5m",
    });
    const refreshToken = genarateJwtToken({
      payload: { _id: userId },
      jwtSecret: secret.refreshTokenSecret,
      expireIn: "30d",
    });

    res.locals.user = user;
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      accessToken,
    });
  }
);

export const getUserInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      errorMessage(res, 404, "User not found");
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const socialAuth = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, avatar } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    const newUser = await UserModel.create({
      fullName,
      email,
      avatar,
      isSocialAuth: true,
    });

    sendToken(newUser, 201, res);
  } else {
    sendToken(user, 200, res);
  }
});

export const updateUserInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, phone, address } = req.body;
    if (req.body.email) {
      errorMessage(res, 400, "You can not update you email");
    }
    console.log(req.file?.filename);
    const userId = res.locals.user._id;

    const user = await UserModel.findById(userId);
    if (!user) {
      errorMessage(res, 404, "User not found");
    }
  }
);
