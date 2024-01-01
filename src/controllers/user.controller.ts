import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { JwtPayload } from "jsonwebtoken";
import { IActivationInfo, IUser } from "../../types/user";
import secret from "../config/secret";
import { deleteImage } from "../lib/deleteImage";
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
  forgotPasswordService,
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
    console.log(user?.avatar);

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

    const userId = res.locals.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      errorMessage(res, 404, "User not found");
    }

    if (req.file) {
      await deleteImage(user?.avatar as string);
    }
    let updateFields: Record<string, any> = {};

    if (fullName) {
      updateFields.fullName = fullName;
    }
    if (phone) {
      updateFields.phone = phone;
    }
    if (address) {
      updateFields.address = address;
    }
    if (req.file?.path) {
      updateFields.avatar = req.file.path;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      errorMessage(res, 404, "User not found");
      return;
    }

    res.status(200).json({
      success: true,
      message: "User info update successfull",
      updatedUser,
    });
  }
);

//update passowrd
export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.findById(res.locals.user._id).select(
    "+password"
  );
  if (!user) {
    errorMessage(res, 404, "User not found");
  }
  if (user?.isSocialAuth) {
    errorMessage(res, 400, "you are not to able update password");
  }

  const isPasswordMatch = await user?.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    errorMessage(res, 400, "Invalid old password");
  }

  if (user?.password) {
    user.password = newPassword;
  }

  await user?.save();

  res.status(200).json({
    success: true,
    message: "Password update successfully",
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    errorMessage(res, 400, "Email is required");
  }

  const user = await UserModel.findOne({ email });
  if (user?.isSocialAuth) {
    errorMessage(res, 400, "You are signup wtih google");
  }
  if (!user) {
    errorMessage(res, 404, "You dont have account with this email");
  }

  await forgotPasswordService(user?._id, email);

  res.status(200).json({
    success: true,
    message: "Check you email",
  });
});

export const forgotPasswordLinkValidation = asyncHandler(async (req, res) => {
  const { userId, token } = req.params;
  if (!userId || !token) {
    res.status(400).send("<h1>Invalid Link. try again</h1>");
  }

  const decoded = verifyJwtToken(token, secret.forgotPasswordSecret);
  if (!decoded) {
    res.status(400).send("<h1>Invalid Link. try again</h1>");
  }

  res.redirect(`${secret.clientUrl}/resetPassword/${userId}/${token}`);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, token, userId } = req.body;

  const user = await UserModel.findById(userId).select("+password");
  if (!user) {
    errorMessage(res, 400, "You dont have account with this email");
  }
  if (user?.isSocialAuth) {
    errorMessage(res, 400, "you are not to able update password");
  }

  const decoded = verifyJwtToken(token, secret.forgotPasswordSecret);
  if (!decoded) {
    errorMessage(res, 400, "Invalid Reset password link");
  }

  if (user?.password) {
    user.password = newPassword;
  }

  await user?.save();

  res.status(200).json({
    success: true,
    message: "Reset password successfully. please login",
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find();
  const userLength = await UserModel.countDocuments();
  if (!users) {
    errorMessage(res, 404, "Users not found");
  }

  res.status(200).json({
    success: true,
    message: "All User here",
    users,
    userLength,
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );
  if (!user) {
    errorMessage(res, 404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User role update successfully",
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (userId === res.locals.user._id) {
    errorMessage(res, 400, "You are not able to delete your self");
  }

  const user = await UserModel.findByIdAndDelete(userId, { new: true });
  if (!user) {
    errorMessage(res, 404, "User not found!");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
