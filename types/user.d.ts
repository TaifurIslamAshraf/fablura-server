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
  comparePassword: (entredPassword) => Promise<boolean>;
  accessToken: () => string;
  refreshToken: () => string;
}
