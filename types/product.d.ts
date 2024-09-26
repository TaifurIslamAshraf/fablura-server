import mongoose, { Document } from "mongoose";

export interface IPorductReviews {
  user: mongoose.Schema.Types.ObjectId;
  fullName: string;
  avatar: string;
  rating: number;
  comment: string;
  approved?: boolean;
  createdOn?: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  discountPrice?: string;
  description: string;
  colors: {name: string, stock: boolean}[];
  stock: number;
  sold: number;
  soldAt: Date;
  shipping: number;
  images: [string];
  numOfReviews: number;
  ratings?: number;
  category: mongoose.Schema.Types.ObjectId;
  subcategory?: string;
  reviews?: IPorductReviews[];
}
