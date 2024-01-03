import mongoose, { Model, Schema } from "mongoose";
import {
  IElectronicsDescription,
  IFoodsDescription,
  IProduct,
} from "../../types/product";

// reviews: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: [true, "Review user is required"],
//       },
//       name: {
//         type: String,
//         required: [true, "Review user name is required"],
//       },
//       rating: {
//         type: Number,
//         required: [true, "Review rating is required"],
//       },
//       comment: {
//         type: String,
//         required: [true, "Review comment is required"],
//       },
//       createdOn: {
//         type: Date,
//         default: Date.now(),
//       },
//     },
//   ],

// ratings: {
//     type: Number,
//     default: 0,
//   },
//   numOfReviews: {
//     type: Number,
//     default: 0,
//   },

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
    estimatePrice: {
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
    shipping: {
      type: Number,
      required: [true, "Product shipping price is required"],
    },
    images: [
      {
        type: String,
        required: [true, "Product images is required"],
      },
    ],

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
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
  },
  {
    timestamps: true,
  }
);

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
      type: Boolean,
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

// Discriminators
const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

ProductModel.discriminator("electronics", electronicsSchema);
ProductModel.discriminator("foods", foodsSchema);

export default ProductModel;
