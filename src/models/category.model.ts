import { Model, Schema, model } from "mongoose";
import { ICategory, ISubCategory } from "../../types/category";

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "category slug is required"],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel: Model<ICategory> = model(
  "Category",
  categorySchema
);

const subCategorySchema: Schema<ISubCategory> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "category slug is required"],
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategoryModel: Model<ISubCategory> = model(
  "SubCategory",
  subCategorySchema
);
