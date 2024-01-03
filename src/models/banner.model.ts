import mongoose, { Model } from "mongoose";
import { IBanners } from "../../types/banner";

const bannerSchema = new mongoose.Schema<IBanners>({
  bannerType: {
    type: String,
    enum: ["topBanner", "mainBanner", "categoryBanner"],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: {
    type: String,
    required: true,
  },
});

const BannerModel: Model<IBanners> = mongoose.model("Banner", bannerSchema);
export default BannerModel;
