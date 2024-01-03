import express from "express";
import {
  createBanner,
  deleteBanners,
  getAllBanners,
  getSingleBanners,
} from "../controllers/banner.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";

const bannerRoute = express.Router();

bannerRoute.post(
  "/create-banner",
  isAuthenticated,
  authorizeUser("admin"),
  fileUploder("public/uploads/banners", true, "image"),
  createBanner
);
bannerRoute.get("/get-all-banners", getAllBanners);
bannerRoute.get("/get-single-banner/:id", getSingleBanners);
bannerRoute.delete(
  "/delete-banner/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteBanners
);

export default bannerRoute;
