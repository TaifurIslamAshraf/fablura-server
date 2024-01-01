import { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  category: Schema.Types.ObjectId;
}
