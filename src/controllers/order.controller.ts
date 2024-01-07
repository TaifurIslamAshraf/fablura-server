import asyncHandler from "express-async-handler";
import { errorMessage } from "../lib/errorHandler";
import { generateId } from "../lib/generateId";
import OrderModel from "../models/order.mode";
import { updateProductStockSold } from "./../services/order.services";

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

  order.orderItems.map(async (value) => {
    await updateProductStockSold(value.product.toString(), value.quentity);
  });

  res.status(201).json({
    success: true,
    message: "Order created successfull",
    order,
  });
});

//get single order
export const getSignleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await OrderModel.findById(id).populate(
    "user",
    "fullName email"
  );

  if (!order) {
    errorMessage(res, 404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order get successfull",
    order,
  });
});

//get user order
export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  let userOrders;

  if (userId) {
    userOrders = await OrderModel.find({ user: userId });
  } else {
    //get order id from cookie
    const cookies = req.cookies;
    const ordersId = Object.keys(cookies).filter((value) => {
      return value.startsWith("orders");
    });

    const orderPromises = ordersId.map(async (value) => {
      const orderId = value.split("-")[1];
      return OrderModel.findOne({ orderId });
    });

    const cookiesOrder = await Promise.all(orderPromises);
    userOrders = cookiesOrder.filter(Boolean);
  }

  if (userOrders.length === 0) {
    errorMessage(res, 404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Your all order here",
    userOrders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = await OrderModel.findById(id);
  if (!order) {
    errorMessage(res, 404, "Order not found");
  }

  if (order?.orderStatus === "Delivered") {
    errorMessage(res, 400, "Order alredy deliverd");
  }
  if (order?.orderStatus) {
    order.orderStatus = orderStatus;
  }

  if (orderStatus === "Delivered" && order && order.deliveredAt !== undefined) {
    order.deliveredAt = new Date(Date.now());
  }

  await order?.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: "Order status updated successfull",
    order,
  });
});

//get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find();
  if (!orders) {
    errorMessage(res, 404, "Orders not found");
  }

  let totalOrdersAmount = 0;

  orders.forEach((value) => {
    totalOrdersAmount += value.totalAmount;
  });

  res.status(200).json({
    success: true,
    message: "Your all order here",
    totalOrdersAmount,
    orders,
  });
});

//delete order
export const deleteOrders = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await OrderModel.findById(id);
  if (!order) {
    errorMessage(res, 200, "order not found");
  }

  await OrderModel.findByIdAndDelete(id, { new: true });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
