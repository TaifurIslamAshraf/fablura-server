import asyncHandler from "express-async-handler";
import { errorMessage } from "../lib/errorHandler";
import CustomerModel from "../models/customarReview.model";

export const createCustomerReview = asyncHandler(async (req, res) => {
  if (!req.file) {
    errorMessage(res, 400, "Image is Required");
  }

  const customerReview = await CustomerModel.create({
    image: req.file?.path,
  });

  res.status(201).json({
    success: true,
    message: "Customer review create successfully",
    customerReview,
  });
});

export const getAllCustomerReview = asyncHandler(async (req, res) => {
  const customerReview = await CustomerModel.find();

  res.status(201).json({
    success: true,
    message: "All Customer review",
    customerReview,
  });
});

export const deleteCustomerReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const customerReview = await CustomerModel.findByIdAndDelete(id, {
    new: true,
  });

  if (!customerReview) {
    errorMessage(res, 404, "Customer review not found");
  }

  res.status(201).json({
    success: true,
    message: "All Customer review",
    customerReview,
  });
});
