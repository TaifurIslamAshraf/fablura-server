import mongoose, { Model, Schema } from "mongoose";
import {
  IElectronicsDescription,
  IFoodsDescription,
  IPorductReviews,
  IProduct,
} from "../../types/product";

const productReviews: Schema<IPorductReviews> = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review user is required"],
  },
  fullName: {
    type: String,
    required: [true, "Review user name is required"],
  },
  rating: {
    type: Number,
    required: [true, "Review rating is required"],
    maxlength: [5, "max rating number 5"],
  },
  comment: {
    type: String,
    required: [true, "Review comment is required"],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const electronicsSchema: Schema<IElectronicsDescription> =
  new mongoose.Schema<IElectronicsDescription>({
    colors: {
      type: String,
      required: [true, "Product color is required !"],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required !"],
    },
    warrantyPeriod: {
      type: String,
    },
    countryOrigin: {
      type: String,
    },
    batteryCapacity: {
      type: String,
    },
    features: {
      type: String,
    },
    dimensions: {
      type: String,
    },
    model: {
      type: String,
    },
    waterproof: {
      type: String,
    },
    powerSupply: {
      type: String,
    },
    bodyMaterials: {
      type: String,
    },
    chargingTime: {
      type: String,
    },
  });

const foodsSchema: Schema<IFoodsDescription> =
  new mongoose.Schema<IFoodsDescription>({
    ingredients: {
      type: String,
      required: [true, "Product ingredients required"],
    },
    foodDesc: {
      type: String,
      required: [true, "Product descriptions required"],
    },
  });

const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "product name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "product slug is required"],
      lowercase: true,
      trim: true,
    },
    descriptionType: {
      type: String,
      enum: ["electronics", "foods"],
      required: [true, "Product description type is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    discountPrice: {
      type: String,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    soldAt: {
      type: Date,
      default: Date.now(),
    },
    shipping: {
      type: Number,
      required: [true, "Product shipping price is required"],
    },
    images: {
      type: [String],
      required: [true, "Product images is required"],
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      // required: [true, "subCategory id is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is required"],
    },

    description: {
      type: Schema.Types.Mixed,
      required: [true, "description is required"],
    },

    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [productReviews],
  },
  {
    timestamps: true,
  }
);

// Discriminators
const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

ProductModel.discriminator("electronics", electronicsSchema);
ProductModel.discriminator("foods", foodsSchema);

export default ProductModel;
