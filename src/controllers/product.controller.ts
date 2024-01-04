import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { deleteMultipleImages } from "../lib/deleteImage";
import { errorMessage } from "../lib/errorHandler";
import ProductModel from "../models/product.model";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    descriptionType,
    price,
    discountPrice,
    stock,
    sold,
    shipping,
    category,
    subcategory,

    ingredients,
    foodDesc,
    color,
    brand,
    warrantyPeriod,
    countryOrigin,
    batteryCapacity,
    features,
    dimensions,
    model,
    waterproof,
    powerSupply,
    bodyMaterials,
    chargingTime,
  } = req.body;

  let productData: any = {
    name,
    descriptionType,
    price,
    discountPrice,
    stock,
    sold,
    shipping,
    category,
    subcategory,
  };

  productData.slug = slugify(name);

  const imagesPath: string[] | undefined = (
    req.files as Express.Multer.File[]
  ).map((file: Express.Multer.File) => file.path);

  if (req.files) {
    productData = {
      ...productData,
      images: imagesPath,
    };
  }

  const nameisExitst = await ProductModel.findOne({ name });
  if (nameisExitst) {
    deleteMultipleImages(imagesPath);
    errorMessage(res, 400, "Product name should be unique");
  }

  // Add description field based on descriptionType
  if (descriptionType === "foods") {
    productData = {
      ...productData,
      description: {
        ingredients,
        foodDesc,
      },
    };
  } else if (descriptionType === "electronics") {
    productData = {
      ...productData,
      description: {
        color,
        brand,
        warrantyPeriod,
        countryOrigin,
        batteryCapacity,
        features,
        dimensions,
        model,
        waterproof,
        powerSupply,
        bodyMaterials,
        chargingTime,
      },
    };
  }

  const product = await ProductModel.create(productData);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});
