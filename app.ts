import { createWriteStream } from "fs";
import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import morgan from "morgan";

import { errorHandler, notFound } from "./src/lib/errorHandler";

export const app = express();

//logger
const accessLogStream = createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

//static folder location
app.use(express.static("public/uploads"));

//body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//cookie-parser
app.use(cookieParser());

//cors setup
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

//test route
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Test successfully",
      data: "This is Data",
    });
  })
);

//error handling
app.use(notFound);
app.use(errorHandler);
