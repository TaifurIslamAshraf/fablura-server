import asyncHandler from "express-async-handler";
import { generateId } from "../lib/generateId";
import OrderModel from "../models/order.mode";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    phone,
    fullName,
    address,
    orderNots,
    paymentType,
    itemsPrice,
    shippingPrice,
    productName,
    price,
    quentity,
    image,
    product,
    totalAmount,
    user,
  } = req.body;

  const orderData = {
    shippingInfo: {
      phone,
      fullName,
      address,
    },
    orderItems: {
      productName,
      price,
      quentity,
      image,
      product,
    },

    orderNots,
    paymentType,
    itemsPrice,
    shippingPrice,
    totalAmount,
    user,
    orderId: generateId(),
  };

  const order = await OrderModel.create(orderData);

  //set order cookie if user not login
  if (!user) {
    res.cookie(`orders-${order.orderId}`, JSON.stringify(order), {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }

  res.status(201).json({
    success: true,
    message: "Order created successfull",
    order,
  });
});
