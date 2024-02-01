import asyncHandler from "express-async-handler";

import { IPorductReviews } from "../../types/product";
import { deleteMultipleImages } from "../lib/deleteImage";
import { errorMessage } from "../lib/errorHandler";
import { slugify } from "../lib/slugify";
import { SubCategoryModel } from "../models/category.model";
import ProductModel from "../models/product.model";
import UserModel from "../models/user.model";

// create products -- admin
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
    colors,
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
    reviews: [],
  };

  productData.slug = slugify(name);

  const imagesPath: string[] | undefined = (
    req.files as Express.Multer.File[]
  ).map((file: Express.Multer.File) => file.path);

  if (!imagesPath || imagesPath.length === 0) {
    errorMessage(res, 400, "Products Images are required");
  }

  if (req.files) {
    productData.images = imagesPath;
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
        colors,
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

//update product -- admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    price,
    discountPrice,
    stock,
    sold,
    shipping,
    category,
    subcategory,
    descriptionType,

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
    price,
    discountPrice,
    stock,
    sold,
    shipping,
    category,
    subcategory,
  };

  if (name) {
    productData.slug = slugify(name);
  }

  const imagesPath = (req.files as Express.Multer.File[]).map(
    (file: Express.Multer.File) => file.path
  );

  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) {
    deleteMultipleImages(imagesPath);
    errorMessage(res, 404, "Product not found");
  }

  const productWithSameName = await ProductModel.findOne({ name });
  if (productWithSameName) {
    deleteMultipleImages(imagesPath);
    errorMessage(res, 400, "Product name should be unique");
  }

  // Add description field based on descriptionType
  let updatedDescription: any = {};

  if (
    descriptionType === "foods" ||
    existingProduct?.descriptionType === "foods"
  ) {
    updatedDescription = {
      ...existingProduct?.description,
      ...(ingredients && { ingredients }),
      ...(foodDesc && { foodDesc }),
    };
  } else if (
    descriptionType === "electronics" ||
    existingProduct?.descriptionType === "electronics"
  ) {
    updatedDescription = {
      ...existingProduct?.description,
      ...(color && { color }),
      ...(brand && { brand }),
      ...(warrantyPeriod && { warrantyPeriod }),
      ...(countryOrigin && { countryOrigin }),
      ...(batteryCapacity && { batteryCapacity }),
      ...(features && { features }),
      ...(dimensions && { dimensions }),
      ...(model && { model }),
      ...(waterproof && { waterproof }),
      ...(powerSupply && { powerSupply }),
      ...(bodyMaterials && { bodyMaterials }),
      ...(chargingTime && { chargingTime }),
    };
  }

  if (imagesPath.length > 0) {
    productData.images = imagesPath;
  }

  productData.description = updatedDescription;
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, productData, {
    new: true,
  });

  if (updatedProduct && existingProduct?.images && imagesPath.length > 0) {
    deleteMultipleImages(existingProduct.images);
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfull",
    updatedProduct,
  });
});

//delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);
  if (!product) {
    errorMessage(res, 404, "Product not found !");
  }

  if (product?.images) {
    await deleteMultipleImages(product.images);
  }

  await product?.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfull",
  });
});

//get single product
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await ProductModel.findOne({ slug })
    .populate("category subcategory")
    .select("-reviews");
  if (!product) {
    errorMessage(res, 404, "Product not found !");
  }

  //find related products
  const relatedProduct = await ProductModel.find(
    {
      subcategory: product?.subcategory,
      _id: { $ne: product?._id },
    },
    {
      name: 1,
      ratings: 1,
      numOfReviews: 1,
      price: 1,
      discountPrice: 1,
      images: 1,
      slug: 1,
    }
  ).limit(6);

  res.status(200).json({
    success: true,
    product,
    relatedProduct,
  });
});

// get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search || "";
  const category = req.query.category || "";
  const subcategory = req.query.subcategory || "";
  const minPrice = parseInt(req.query.minPrice as string) || 0;
  const maxPrice =
    parseInt(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;
  const ratings = parseFloat(req.query.ratings as string) || 0;

  const searchWords = (search as string)
    .split(/\s+/)
    .map((word) => `(?=.*\\b${word}\\b)`)
    .join("");
  const searchRegExp = new RegExp(`^${searchWords}.*$`, "i");

  const filter: any =
    {
      // category: category,
      // subcategory: subcategory,
      // price: { $gte: minPrice, $lte: maxPrice },
      // ratings: { $gte: ratings },
      $or: [{ name: { $regex: searchRegExp } }],
    } || {};

  if (category) {
    filter.category = category;
  }
  if (subcategory) {
    filter.subcategory = subcategory;
  }
  filter.$and = [
    { discountPrice: { $exists: true } },
    { discountPrice: { $gte: minPrice, $lte: maxPrice } },
  ];
  filter.ratings = { $gte: ratings };

  const products = await ProductModel.find(filter)
    .select("-reviews")
    .populate(["category", "subcategory"])
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products || products.length < 1) {
    errorMessage(res, 404, "No Product availble");
  }
  const productCount = await ProductModel.countDocuments(filter);
  const categories = await ProductModel.distinct("category", filter);
  const allSubcategory = await SubCategoryModel.find({
    category: { $in: categories },
  });

  res.status(200).json({
    success: true,
    message: "All products here",
    products,

    allSubcategory,
    pagination: {
      numberOfProducts: productCount,
      totalPage: Math.ceil(productCount / limit),
      currentPage: page,
      nextPage: page + 1,
      prevPage: page - 1,
    },
  });
});

//get resent sold product
export const getResentSoldProducts = asyncHandler(async (req, res) => {
  const product = await ProductModel.find().sort({ soldAt: -1 }).limit(10);
  if (!product) {
    errorMessage(res, 404, "Product not found");
  }

  res.status(200).json({
    message: "Resently sold product",
    success: true,
    product,
  });
});

//create review
export const createReviews = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;
  const user = res.locals.user;

  if (!user) {
    errorMessage(res, 404, "User Not found");
  }

  const review: IPorductReviews = {
    user: user._id,
    fullName: user.fullName,
    avatar: user?.avatar,
    rating,
    comment,
  };

  const product = await ProductModel.findById(productId);
  if (!product) {
    errorMessage(res, 404, "Product not found");
  }

  if (product?.reviews) {
    const isReviewd = product?.reviews.some(
      (rev) => rev.user.toString() === user._id.toString()
    );

    if (isReviewd) {
      errorMessage(res, 400, "You alredy give a review");
    }
  }

  if (product?.reviews) {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //product rating avarage
  let avg = 0;
  product?.reviews?.forEach((value) => {
    avg += value.rating;
  });

  if (product?.reviews) {
    product.ratings = avg / product.reviews.length;
  }

  await product?.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "review created successfull",
    review: product?.reviews,
  });
});

//update review status
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { reviewId, productId, approved } = req.body;

  const product = await ProductModel.findById(productId);
  if (!product) {
    errorMessage(res, 404, "Product not found");
  }

  if (product?.reviews) {
    const review = product.reviews.find((value: any) => {
      return value._id.toString() === reviewId;
    });

    if (review?.approved !== undefined) {
      review.approved = Boolean(approved);
    } else {
      errorMessage(res, 404, "Review not exits");
    }
  }
  await product?.save();

  res.status(200).json({
    success: true,
    message: "Product review status updated",
    product,
  });
});

//delete review --admin
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId, productId } = req.params;

  const product = await ProductModel.findById(productId);
  if (!product) {
    errorMessage(res, 404, "Product not found");
  }

  if (product?.reviews) {
    const productIndex = product?.reviews?.findIndex(
      (value: any) => value._id.toString() === reviewId.toString()
    );
    if (productIndex === -1) {
      errorMessage(res, 404, "review not found");
    }
    product?.reviews?.splice(productIndex, 1);
  }

  let avg = 0;
  product?.reviews?.forEach((value) => {
    avg += value.rating;
  });

  if (product?.reviews) {
    product.ratings = avg / product.reviews.length;
    product.numOfReviews = product.reviews.length;
  }

  await product?.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "Product review deleted successfully",
    product,
  });
});

//get all reviews -- admin
export const getAllProductsReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 15;

  const productsReviews = await ProductModel.aggregate([
    {
      $unwind: "$reviews",
    },
    {
      $match: {
        "reviews.approved": false,
      },
    },
    {
      $group: {
        _id: "$_id",
        productName: { $first: "$name" },
        productId: { $first: "$_id" },
        reviews: { $push: "$reviews" },
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  const countProduct = await ProductModel.countDocuments();

  res.status(200).json({
    success: true,
    message: "All product reviews",
    productsReviews,
    pagination: {
      totalPage: Math.ceil(countProduct / limit),
      currentPage: page,
      nextPage: page + 1,
      prevPage: page - 1,
    },
  });
});

//get product reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  const { userId, productId } = req.query;

  const product = await ProductModel.findById(productId);
  if (!product) {
    errorMessage(res, 404, "Products not found");
  }

  const userLength = await UserModel.countDocuments();

  let reviews: any = product?.reviews || [];

  let productReviews = reviews?.filter((item: any) => {
    return (userId && item?.user?.toString() === userId) || item.approved;
  });

  res.status(200).json({
    success: true,
    message: "all product reviews",
    productReviews,
    userLength,
  });
});

//get cart product
export const cartProducts = asyncHandler(async (req, res) => {
  const productId = req.cookies.product_cart;

  const productIdsArray = JSON.parse(productId);

  if (!productIdsArray && productIdsArray.length === 0) {
    errorMessage(res, 404, "Cart item not found");
  }

  const products = await ProductModel.find({ _id: { $in: productIdsArray } });

  if (!products || products.length === 0) {
    errorMessage(res, 404, "Products not found");
  }

  const formattedProducts = products.map((product) => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    images:
      product.images && product.images.length > 0 ? product.images[0] : null,
    discountPrice: product.discountPrice,
    slug: product.slug,
  }));

  res.status(200).json({
    success: true,
    message: "All cart items here",
    products: formattedProducts,
  });
});
