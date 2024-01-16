import express from "express";
import {
  createCustomerReview,
  deleteCustomerReview,
  getAllCustomerReview,
} from "../controllers/customarReview.controller";
import { authorizeUser, isAuthenticated } from "../middlewares/authGard";
import { fileUploder } from "../middlewares/uploadFile";

const customerReviewRoute = express.Router();

customerReviewRoute.post(
  "/create-customer-review",
  isAuthenticated,
  authorizeUser("admin"),
  fileUploder("public/uploads/customerReview", true, "image"),
  createCustomerReview
);
customerReviewRoute.get("/get-customer-review", getAllCustomerReview);
customerReviewRoute.delete(
  "/delete-customer-review/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteCustomerReview
);

export default customerReviewRoute;
