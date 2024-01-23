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
            totalMainPrice: product?.price!,
            totalDiscountPrice: parseInt(product?.discountPrice!),
          },
        },

        totalPrice: {
          price: cart?.totalPrice?.price! + product?.price!,
          discountPrice:
            cart?.totalPrice?.discountPrice! +
            parseInt(product?.discountPrice!),
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
        totalMainPrice: product?.price,
        totalDiscountPrice: parseInt(product?.discountPrice!),
      },
      totalPrice: {
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

export const syncCart = asyncHandler(async (req, res) => {
  //select, selectAll, increment quantity, descriment quantity
  const {
    isSelect,
    productId,
    isSelectAll,
    incrementQuantity,
    descrimentQuantity,
  } = req.query;

  //find session cart
  const sessionId = req.cookies.cart_session;
  if (!sessionId) {
    errorMessage(res, 400, "Invalid Cart Product");
  }

  const cart = await CartModel.findOne({ sessionId: sessionId });
  if (!cart) {
    errorMessage(res, 404, "Cart items not found");
  }

  //toggle product selection
  if (isSelect && productId) {
    const cartProduct = cart?.cartItem.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartProduct) {
      errorMessage(res, 404, "cart product not found");
    }

    if (cartProduct?.selected !== undefined) {
      cartProduct.selected = isSelect === "false" ? false : true;

      //calculate cart total product price
      if (cart?.totalPrice && cartProduct.selected) {
        cart.totalPrice.price =
          cart.totalPrice.price + cartProduct.totalMainPrice;

        cart.totalPrice.discountPrice =
          cart.totalPrice.discountPrice + cartProduct.totalDiscountPrice;
      }

      //calculate cart total product price
      if (cart?.totalPrice && !cartProduct.selected) {
        cart.totalPrice.price =
          cart.totalPrice.price - cartProduct.totalMainPrice;

        cart.totalPrice.discountPrice =
          cart.totalPrice.discountPrice - cartProduct.totalDiscountPrice;
      }
    }

    await cart?.save();
  }

  //toggle product select All
  if (isSelectAll !== undefined) {
    let totalMainPrice = 0;
    let totalDiscountPrice = 0;
    cart?.cartItem.forEach((item) => {
      item.selected = isSelectAll === "false" ? false : true;

      totalMainPrice += item.totalMainPrice;
      totalDiscountPrice += item.totalDiscountPrice;
    });

    if (cart?.selectAll !== null && cart) {
      cart.selectAll = isSelectAll === "false" ? false : true;
    }

    if (cart?.totalPrice && isSelectAll === "true") {
      cart.totalPrice.price = totalMainPrice;
      cart.totalPrice.discountPrice = totalDiscountPrice;
    } else if (cart?.totalPrice && isSelectAll === "false") {
      cart.totalPrice.price = 0;
      cart.totalPrice.discountPrice = 0;
    }

    await cart?.save();
  }

  //increment product quantity
  if (incrementQuantity && productId) {
    const cartProduct = cart?.cartItem.find(
      (item) => item.productId.toString() === productId
    );

    if (cartProduct?.quantity! >= 1 && cartProduct?.quantity) {
      cartProduct.quantity++;

      const product = await ProductModel.findById(productId);
      if (!product) {
        errorMessage(res, 404, "Product not exist");
      }

      //calculate product quantity price
      cartProduct.totalMainPrice = cartProduct.totalMainPrice + product?.price!;

      cartProduct.totalDiscountPrice =
        cartProduct.totalDiscountPrice + parseInt(product?.discountPrice!);

      //calculate cart total product price
      if (cart?.totalPrice && cartProduct.selected) {
        let totalMainPrice = 0;
        let totalDiscountPrice = 0;
        cart?.cartItem.forEach((item) => {
          totalMainPrice += item.totalMainPrice;
          totalDiscountPrice += item.totalDiscountPrice;
        });

        cart.totalPrice.price = totalMainPrice;
        cart.totalPrice.discountPrice = totalDiscountPrice;
      }
    }

    await cart?.save();
  }

  //decrement product quantity
  if (descrimentQuantity && productId) {
    const cartProduct = cart?.cartItem.find(
      (item) => item.productId.toString() === productId
    );

    if (cartProduct?.quantity! > 1 && cartProduct?.quantity) {
      cartProduct.quantity--;

      const product = await ProductModel.findById(productId);
      if (!product) {
        errorMessage(res, 404, "Product not exist");
      }

      //calculate product quantity price
      cartProduct.totalMainPrice = cartProduct.totalMainPrice - product?.price!;

      cartProduct.totalDiscountPrice =
        cartProduct.totalDiscountPrice - parseInt(product?.discountPrice!);

      //calculate cart total product price
      //calculate cart total product price
      if (cart?.totalPrice && cartProduct.selected) {
        let totalMainPrice = 0;
        let totalDiscountPrice = 0;
        cart?.cartItem.forEach((item) => {
          totalMainPrice += item.totalMainPrice;
          totalDiscountPrice += item.totalDiscountPrice;
        });

        cart.totalPrice.price = totalMainPrice;
        cart.totalPrice.discountPrice = totalDiscountPrice;
      }
    }

    await cart?.save();
  }

  await cart?.save();

  res.status(200).json({
    success: true,
    message: "cart product was sync",
    cart,
  });
});
