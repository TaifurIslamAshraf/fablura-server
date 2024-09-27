import mongoose, { Model, Schema } from "mongoose";
import {

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
  avatar: {
    type: String,
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
    default: () => new Date(),
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

    price: {
      type: Number,
    },
    discountPrice: {
      type: String,
      default: 0,
      required: [true, "Product descountPrice price is required"],
    },

    description: {

      type: String,
      required: [true, "Product description is required"],
    },

    colors: {
      type: [
        {
          name: { type: String, required: true },
          stock: { type: Boolean, required: true },
        }
      ],
      required: [true, "Product colors are required"],
    },
    size: {
      type: [
        {
          name: { type: String, required: true },
          available: { type: Boolean, required: true },
        }
      ],
      required: [true, "Product size are required"],
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
      required: [true, "subCategory id is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is required"],
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

productSchema.index(
  {
    name: "text",
    description: "text",
    slug: "text",
  },
  {
    weights: {
      name: 5,
      description: 3,
      slug: 4,
    },
  }
);

const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default ProductModel;
