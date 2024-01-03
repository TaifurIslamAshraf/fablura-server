import mongoose, { Document } from "mongoose";

// export interface IPorduct extends Document {
//   reviews?: [
//     {
//       user: string;
//       name: string;
//       rating: number;
//       comment: string;
//       cratedOn: Date;
//     }
//   ];
// }

export interface IElectronicsDescription {
  colors: string;
  brand: string;
  warrantyPeriod?: string;
  countryOrigin?: string;
  batteryCapacity?: string;
  features?: string;
  dimensions?: string;
  model?: string;
  waterproof?: boolean;
  powerSupply?: string;
  bodyMaterials?: string;
  chargingTime?: string;
}

export interface IFoodsDescription {
  ingredients: string;
  foodDesc: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  descriptionType: "electronics" | "foods";
  price: number;
  estimatePrice?: string;
  stock: number;
  sold: number;
  shipping: number;
  images: [string];

  description: IElectronicsDescription | IFoodsDescription;
  category: mongoose.Schema.Types.ObjectId;
  subcategory?: string;
}

// numOfReviews: number;
// ratings?: number;
