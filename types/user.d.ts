import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  isSocialAuth: boolean;
  avatar: string;
  role: "admin" | "user";
  address: string;
  phone: string;
  reviewsInfo?: {
    productId: String;
    reviewsCounter?: Number;
  }[];
  comparePassword: (entredPassword) => Promise<boolean>;
  accessToken: () => string;
  refreshToken: () => string;
}

export interface IActivationInfo {
  fullName: string;
  email: string;
  password: string;
  isSocialAuth: boolean;
  avatar?: string;
  address: string;
  phone: string;
}
