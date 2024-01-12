import asyncHandler from "express-async-handler";

import { deleteImage } from "../lib/deleteImage";
import { errorMessage } from "../lib/errorHandler";
import BannerModel from "../models/banner.model";

export const createBanner = asyncHandler(async (req, res) => {
  const { bannerType, category } = req.body;

  if (!req.file) {
    errorMessage(res, 400, "Banner image is required");
  }

  if (bannerType === "categoryBanner" && !category) {
    if (req.file) {
      await deleteImage(req.file.path);
    }
    errorMessage(res, 400, "category is required");
  }
  if (category && bannerType !== "categoryBanner") {
    if (req.file) {
      await deleteImage(req.file.path);
    }
    errorMessage(res, 400, "Your banner type should be categoryBanner");
  }

  const banner = await BannerModel.create({
    bannerType,
    category,
    image: req.file?.path,
  });

  res.status(201).json({
    success: true,
    message: "Banner create successfull",
    banner,
  });
});

export const getAllBanners = asyncHandler(async (req, res) => {
  const { bannerType } = req.query;

  let query = {};
  if (bannerType) {
    query = { bannerType };
  }

  const banner = await BannerModel.find(query).populate("category");
  if (!banner) {
    errorMessage(res, 404, "Banner not found");
  }

  res.status(201).json({
    success: true,
    message: "All Banners here",
    banner,
  });
});

export const getSingleBanners = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await BannerModel.findById(id).populate("category");
  if (!banner) {
    errorMessage(res, 404, "Banner not found");
  }

  res.status(201).json({
    success: true,
    banner,
  });
});

export const deleteBanners = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await BannerModel.findByIdAndDelete(id, { new: true });
  if (!banner) {
    errorMessage(res, 404, "Banner not found");
  }
  if (banner?.image) {
    deleteImage(banner.image);
  }

  res.status(201).json({
    success: true,
    message: "banner deleted successfully",
  });
});
