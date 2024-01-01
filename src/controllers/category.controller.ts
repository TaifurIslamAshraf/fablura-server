import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { errorMessage } from "../lib/errorHandler";
import { CategoryModel, SubCategoryModel } from "../models/category.model";

// category crud endpoint
export const createCategory = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name } = req.body;

  const slug = slugify(name, {
    lower: true,
    trim: true,
  });

  const category = await CategoryModel.create({
    name,
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Category create successfull",
    category,
  });
});

export const getAllCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.find();
  if (!category) {
    errorMessage(res, 404, "You dont have any category");
  }
  const categoryLength = await CategoryModel.countDocuments();

  res.status(201).json({
    success: true,
    category,
    categoryLength,
  });
});

export const getSignleCategory = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const category = await CategoryModel.findOne({ slug: slug });
  if (!category) {
    errorMessage(res, 404, "Category not found!");
  }

  res.status(201).json({
    success: true,
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, id } = req.body;

  const slug = slugify(name, {
    lower: true,
    trim: true,
  });

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug,
    },
    { new: true }
  );
  if (!category) {
    errorMessage(res, 404, "Category not found!");
  }

  res.status(201).json({
    success: true,
    message: "Category updated successfull",
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );
  if (!category) {
    errorMessage(res, 404, "Category not found!");
  }

  res.status(201).json({
    success: true,
    message: "category deleted successfull",
  });
});

// sub category crud endpoint
export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const slug = slugify(name, {
    lower: true,
    trim: true,
  });

  const subcategory = await SubCategoryModel.create({
    name,
    slug,
    category: category,
  });

  res.status(201).json({
    success: true,
    message: "Subcategory create successfull",
    subcategory,
  });
});

export const getAllSubCategory = asyncHandler(async (req, res) => {
  const subcategory = await SubCategoryModel.find();
  if (!subcategory) {
    errorMessage(res, 404, "You dont have any subcategory");
  }

  res.status(201).json({
    success: true,
    subcategory,
  });
});

export const getSignleSubCategory = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const subcategory = await SubCategoryModel.findOne({ slug: slug });
  if (!subcategory) {
    errorMessage(res, 404, "subcategory not found!");
  }

  res.status(201).json({
    success: true,
    subcategory,
  });
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, id } = req.body;

  const slug = slugify(name, {
    lower: true,
    trim: true,
  });

  const subcategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug,
    },
    { new: true }
  );
  if (!subcategory) {
    errorMessage(res, 404, "subcategory not found!");
  }

  res.status(201).json({
    success: true,
    message: "subcategory updated successfull",
    subcategory,
  });
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const subcategory = await SubCategoryModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );
  if (!subcategory) {
    errorMessage(res, 404, "subcategory not found!");
  }

  res.status(201).json({
    success: true,
    message: "subcategory deleted successfull",
  });
});
