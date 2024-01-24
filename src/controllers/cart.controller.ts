import asyncHandler from "express-async-handler";
import { errorMessage } from "../lib/errorHandler";
import { generateId } from "../lib/generateId";
import CartModel from "../models/cart.model";
import ProductModel from "../models/product.model";

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
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
        price: product?.price,
        discountPrice: parseInt(product?.discountPrice!),
      },
    });

    // set cookie session
    const expiarationDate = new Date();
    expiarationDate.setMonth(expiarationDate.getMonth() + 1);

    res.cookie("cart_session", sessionId, {
      httpOnly: true,
      expires: expiarationDate,
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
      $lookup: {
        from: "products",
        localField: "cartItem.productId",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $project: {
        _id: 1,
        sessionId: 1,
        totalMainPrice: 1,
        totalDiscountPrice: 1,
        selectAll: 1,
        "cartItem.productId": 1,
        "cartItem.quantity": 1,
        "cartItem.selected": 1,
        "cartItem.price": 1,
        "cartItem.discountPrice": 1,
        "cartItem.product": {
          name: { $arrayElemAt: ["$products.name", 0] },
          image: {
            $arrayElemAt: [{ $arrayElemAt: ["$products.images", 0] }, 0],
          },
          shipping: { $arrayElemAt: ["$products.shipping", 0] },
          slug: { $arrayElemAt: ["$products.slug", 0] },
        },
      },
    },
    {
      $unset: "products",
    },
    {
      $match: { "cartItem.selected": true },
    },
    {
      $group: {
        _id: null,
        totalMainPrice: { $sum: "$cartItem.price" },
        totalDiscountPrice: { $sum: "$cartItem.discountPrice" },
        cart: { $push: "$$ROOT" }, // Store the selected cart items in an array
      },
    },
  ]);

  // Extract the results from the aggregation pipeline
  const [aggregatedResult] = cart;

  // If there are selected items, update the totals in the cart document
  if (aggregatedResult) {
    const {
      totalMainPrice,
      totalDiscountPrice,
      cart: selectedCartItems,
    } = aggregatedResult;

    // Update total prices in the cart document
    await CartModel.updateOne(
      { sessionId: sessionId },
      {
        $set: {
          totalMainPrice: totalMainPrice,
          totalDiscountPrice: totalDiscountPrice,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "cart products",
      cart: selectedCartItems,
    });
  } else {
    // Handle the case where there are no selected items
    res.status(200).json({
      success: true,
      message: "No selected cart products",
      cart: [],
    });
  }
});

export const syncCart = asyncHandler(async (req, res) => {
  //select, selectAll, increment quantity, descriment quantity
  const { isSelect, productId, isSelectAll, cartQuantity } = req.query;

  //find session cart
  const sessionId = req.cookies.cart_session;
  if (!sessionId) {
    errorMessage(res, 400, "Invalid Cart Product");
    return;
  }

  //toggle product selection
  if (isSelect && productId) {
    const updatedCartItem = await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem.productId": productId,
      },
      {
        $set: {
          "cartItem.$.selected": isSelect === "false" ? false : true,
        },
      }
    );

    if (!updatedCartItem) {
      errorMessage(res, 404, "cart product not found");
    }
  }

  //toggle product select All
  if (isSelectAll !== undefined) {
    const isSelectedAll = isSelectAll === "false" ? false : true;

    const updatedCartItem = await CartModel.findOneAndUpdate(
      {
        sessionId,
      },
      {
        selectAll: isSelectedAll,
        $set: { "cartItem.$[].selected": isSelectedAll },
      },
      { new: true }
    );

    if (!updatedCartItem) {
      errorMessage(res, 404, "cart product not found");
    }
  }

  //increment product quantity
  if (cartQuantity && productId) {
    const updatedCartItem = await CartModel.findOneAndUpdate(
      {
        sessionId,
        "cartItem.productId": productId,
      },
      {
        $set: { "cartItem.$.quantity": parseInt(cartQuantity as string) },
      },
      { new: true }
    );

    if (!updatedCartItem) {
      errorMessage(res, 404, "Product not exist");
    }
  }

  res.status(200).json({
    success: true,
    message: "cart product was sync",
  });
});
