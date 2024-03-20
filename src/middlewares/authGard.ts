import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { JwtPayload } from "jsonwebtoken";
import secret from "../config/secret";
import { errorMessage } from "../lib/errorHandler";
import { verifyJwtToken } from "../lib/verifyToken";
import UserModel from "../models/user.model";

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.headers.refresh_token as string;
    console.log(refresh_token);
    if (!refresh_token) {
      errorMessage(res, 400, "Please login to access this recourse");
    }
    const decoded = verifyJwtToken(
      refresh_token,
      secret.refreshTokenSecret
    ) as JwtPayload;

    if (!decoded) {
      errorMessage(res, 400, "Invalid access token. please login");
    }

    const user = await UserModel.findById(decoded._id);

    if (!user) {
      errorMessage(res, 400, "Please login to access this recourse");
    }

    res.locals.user = user;

    next();
  }
);

export const authorizeUser = (...roles: string[]) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(res.locals.user.role)) {
      errorMessage(
        res,
        403,
        `${res.locals.user.role} is not allowed to access this recourse`
      );
    }

    next();
  });
};
