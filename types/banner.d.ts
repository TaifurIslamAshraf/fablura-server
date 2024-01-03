import mongoose, { Document } from "mongoose";

export interface IBanners extends Document {
  bannerType: string;
  category: mongoose.Schema.Types.ObjectId;
  image: string;
}
