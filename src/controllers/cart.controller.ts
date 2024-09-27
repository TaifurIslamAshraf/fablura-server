import asyncHandler from "express-async-handler";
import corn from "node-cron";

import { errorMessage } from "../lib/errorHandler";
import { generateId } from "../lib/generateId";
import CartModel from "../models/cart.model";
import ProductModel from "../models/product.model";
import { IAddTToCart } from "../../types/cart";

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, colors, size } = req.body as IAddTToCart;
  const cartSession = req.cookies.cart_session;

  const product = await ProductModel.findById(productId);
  if (!product) {
    errorMessage(res, 404, "Product not exist");
  }

  if (cartSession) {
    const cart = await CartModel.findOne({ sessionId: cartSession });
    if (!cart) {
      errorMessage(res, 404, "Cart item not found");
    }

    const isExistProductCart = cart?.cartItem?.find(
      (item) => item.productId.toString() === productId
    );
    if (isExistProductCart) {
      errorMessage(res, 400, "Product Alredy In Cart");
    }

    const cartItems = await CartModel.findOneAndUpdate(
      { sessionId: cartSession },
      {
        $push: {
          cartItem: {
            productId,
            colors: colors,
            size: size,
            price: product?.price,
            discountPrice: parseInt(product?.discountPrice!),
           
          },
        },
      },
      { runValidators: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product Add to cart",
      cartItems,
    });
  } else {
    const sessionId = generateId();

    const newCart = await CartModel.create({
      sessionId: sessionId,
      cartItem: {
        productId,
        colors: colors,
        size: size,
        price: product?.price,
        discountPrice: parseInt(product?.discountPrice!),
      },
    });

    // set cookie session
    const expiarationDate = new Date();
    expiarationDate.setMonth(expiarationDate.getMonth() + 2);

    res.cookie("cart_session", sessionId, {
      httpOnly: true,
      expires: expiarationDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Product Add to cart",
      cartItems: newCart,
    });
  }
});

export const getCartItem = asyncHandler(async (req, res) => {
  // find session cart
  const sessionId = req.cookies.cart_session;

  if (!sessionId) {
    errorMessage(res, 400, "Invalid Cart Product");
  }

  const cart = await CartModel.aggregate([
    {
      $match: { sessionId: sessionId },
    },
    {
      $unwind: "$cartItem", // Flatten the cartItem array
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItem.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        "cartItem.productId": 1,
        "cartItem.quantity": 1,
        "cartItem.selected": 1,
        "cartItem.price": 1,
        "cartItem.discountPrice": 1,
        "cartItem.colors": 1,
        "cartItem.size": 1,
        "cartItem.product": {
          name: { $arrayElemAt: ["$product.name", 0] },
          image: {
            $arrayElemAt: [{ $arrayElemAt: ["$product.images", 0] }, 0],
          },
          colors:{
            $arrayElemAt: ["$product.colors", 0]
          },
          size:{
            $arrayElemAt: ["$product.size", 0]
          },
          shipping: { $arrayElemAt: ["$product.shipping", 0] },
          slug: { $arrayElemAt: ["$product.slug", 0] },
        },
        selectAll: "$selectAll",
      },
    },
    {
      $group: {
        _id: "$_id",
        sessionId: { $first: "$sessionId" },
        cartItem: { $push: "$cartItem" },
        totalMainPrice: { $first: "$totalMainPrice" },
        totalDiscountPrice: { $first: "$totalDiscountPrice" },
        selectAll: { $max: "$selectAll" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "cart products",
    cartItem: cart[0].cartItem,
    selectAll: cart.length > 0 ? cart[0].selectAll : null,
  });
});

export const syncCart = asyncHandler(async (req, res) => {
  const { isSelect, productId, isSelectAll, cartQuantity, deleteCartItem, colors, size } =
    req.query;
  const sessionId = req.cookies.cart_session;

  if (!sessionId) {
    errorMessage(res, 400, "Invalid Cart Product");
    return;
  }

  if (isSelect !== undefined && productId) {
    // Toggle product selection
    const updatedCartItem = await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem.productId": productId,
      },
      {
        $set: {
          "cartItem.$.selected": isSelect === "false" ? false : true,
        },
      },
      { new: true }
    );

    if (!updatedCartItem) {
      errorMessage(res, 404, "cart product not found");
      return;
    }

    // Check if all items are selected
    const allItemsSelected = updatedCartItem.cartItem.every(
      (item) => item.selected
    );

    // Update selectAll based on the condition for the specific productId
    await CartModel.findOneAndUpdate(
      {
        sessionId,
      },
      {
        selectAll: allItemsSelected,
      },
      { new: true }
    );
  }

  if (isSelectAll !== undefined) {
    // Toggle select all
    const isSelectedAll = isSelectAll === "false" ? false : true;

    await CartModel.findOneAndUpdate(
      {
        sessionId,
      },
      {
        selectAll: isSelectedAll,
        $set: { "cartItem.$[].selected": isSelectedAll },
      },
      { new: true }
    );
  }

  if (cartQuantity && productId) {
    // Update product quantity
    await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem.productId": productId,
      },
      {
        $set: { "cartItem.$.quantity": parseInt(cartQuantity as string) },
      },
      { new: true }
    );
  }

  if (colors && productId) {
    // Update product selected colors
    await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem.productId": productId,
      },
      {
        $set: { "cartItem.$.colors": colors },
      },
      { new: true }
    );
  }

  if (size && productId) {
    // Update product selected colors
    await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem.productId": productId,
      },
      {
        $set: { "cartItem.$.size": size },
      },
      { new: true }
    );
  }

  if (deleteCartItem !== undefined && productId) {
    // Delete specific item from the cart
    const updatedCartItem = await CartModel.findOneAndUpdate(
      { sessionId },
      {
        $pull: {
          cartItem: { productId },
        },
      },
      { new: true }
    );

    const allItemsSelected = updatedCartItem?.cartItem.every(
      (item) => item.selected
    );

    await CartModel.findOneAndUpdate(
      { sessionId },
      {
        selectAll: allItemsSelected,
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "cart product was sync",
  });
});

export const calculatePrice = asyncHandler(async (req, res) => {
  // find session cart
  const sessionId = req.cookies.cart_session;
  if (!sessionId) {
    errorMessage(res, 400, "Invalid Cart Product");
  }
  const cart = await CartModel.findOne({ sessionId });

  if (!cart) {
    errorMessage(res, 400, "Cart not found");
    return;
  }

  const selectedProduct = cart.cartItem.filter(
    (item) => item.selected === true
  );

  const totalMainPrice = selectedProduct.reduce(
    (aqu, curr) => aqu + curr.price * curr.quantity,
    0
  );
  const totalDiscountPrice = selectedProduct.reduce(
    (aqu, curr) => aqu + curr.discountPrice * curr.quantity,
    0
  );

  cart.totalMainPrice = totalMainPrice;
  cart.totalDiscountPrice = totalDiscountPrice;

  await cart.save();

  res.status(200).json({
    success: true,
    totalMainPrice,
    totalDiscountPrice,
  });
});

//delete cart two month ago cart
corn.schedule("0 0 0 * * *", async () => {
  try {
    const twoMothAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    await CartModel.deleteMany({
      createdAt: { $lt: twoMothAgo },
    });
  } catch (error: any) {
    console.log(error.message);
  }
});
