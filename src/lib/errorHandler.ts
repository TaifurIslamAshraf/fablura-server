import { NextFunction, Request, Response } from "express";

export const errorMessage = (
  res: Response,
  statusCode: number,
  message: string
) => {
  res.status(statusCode);
  throw new Error(message);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  //mongoose not found error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    console.log("orders", err);
    statusCode = 404;
    message = "Resource not found !";
  }

  //mongoose duplicate key error
  if (err.code === 1100) {
    statusCode = 400;
    message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
  }

  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    statusCode = 400;
    message = "Json web token is invalid";
  }

  //jwt expired error
  if (err.name === "TokenExpiredError") {
    statusCode = 400;
    message = "Your Token is Expired. Try Again";
  }

  // //multer error
  // if (err instanceof multer.MulterError) {
  //   statusCode = 500;
  //   message = "There was an upload error!";
  // }

  res.status(statusCode).json({
    succss: false,
    message,
    // stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
