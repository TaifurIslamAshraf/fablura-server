import { Response } from "express";

import dotenv from "dotenv";
import secret from "../config/secret";

interface ICookieOption {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

dotenv.config();

//parse env value to inregate with falback value
const accessTokenExpire = parseInt(secret.accessTokenExpire || "1", 10);
const refreshTokenExpire = parseInt(secret.refreshTokenExpire || "1", 10);

//options for cookis
export const accessTokenCookieOptions: ICookieOption = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenCookieOptions: ICookieOption = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: any, statusCode: number, res: Response) => {
  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  //in production mode secure true in cookie options for refresh token
  if (process.env.NODE_ENV === "production") {
    refreshTokenCookieOptions.secure = true;
    accessTokenCookieOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: "User login successfully",
    user,
    accessToken,
  });
};
