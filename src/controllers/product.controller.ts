import asyncHandler from "express-async-handler";
import ProductModel from "../models/product.model";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    descriptionType,
    price,
    estimatePrice,
    stock,
    sold,
    shipping,
    category,
    description: {
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
    },
  } = req.body;

  let productData: any = {
    name,
    slug,
    descriptionType,
    price,
    estimatePrice,
    stock,
    sold,
    shipping,
    category,
  };

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
