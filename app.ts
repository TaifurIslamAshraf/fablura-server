import { createWriteStream } from "fs";
import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors";
import ejs from "ejs";
import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import morgan from "morgan";

import { errorHandler, notFound } from "./src/lib/errorHandler";
import bannerRoute from "./src/routes/banner.route";
import cartRoute from "./src/routes/cart.route";
import { categoryRoute, subcategoryRoute } from "./src/routes/category.route";
import customerReviewRoute from "./src/routes/customarReview.route";
import orderRoute from "./src/routes/order.route";
import productRoute from "./src/routes/product.route";
import userRoute from "./src/routes/user.route";

export const app = express();

//logger
const accessLogStream = createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

//static folder location
app.use("/public", express.static("public"));

//set view engine to ejs
app.set("view engine", ejs);

//body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//cookie-parser
app.use(cookieParser());

//alowed origin
const origin = [
  "http://localhost:3000",
  "https://my-shop-client-tawny.vercel.app",
  "https://my-shop-client-1wulznv9q-taifurislamashraf.vercel.app",
  "https://my-shop-client-git-next-auth-version-taifurislamashraf.vercel.app/",
];

//cors setup
app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);

// console.log(require("crypto").randomBytes(32).toString("hex"));

//all routes here
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subcategory", subcategoryRoute);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/review", customerReviewRoute);
app.use("/api/v1/cart", cartRoute);

//test route
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Test successfully new",
      data: "This is Test Data",
    });
  })
);

//error handling
app.use(notFound);
app.use(errorHandler);
