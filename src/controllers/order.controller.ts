import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import secret from "../config/secret";
import { errorMessage } from "../lib/errorHandler";
import { generateId } from "../lib/generateId";
import { sendMails } from "../lib/sendMail";
import CartModel from "../models/cart.model";
import OrderModel from "../models/order.mode";
import {
  updateProductStockSold,
  updateReviewInfo,
} from "../services/order.services";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    phone,
    fullName,
    address,
    orderNots,
    paymentType,
    itemsPrice,
    shippingPrice,
    orderItems,
    totalAmount,
    user,
  } = req.body;

  const orderData = {
    shippingInfo: {
      phone,
      fullName,
      address,
    },
    orderItems,

    orderNots,
    paymentType,
    itemsPrice,
    shippingPrice,
    totalAmount,
    user: user,
    orderId: generateId(),
  };

  const order = await OrderModel.create(orderData);

  //set order cookie if user not login
  if (!user) {
    res.cookie(`orders-${order.orderId}`, JSON.stringify(order.orderId), {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  const sessionId = req.cookies.cart_session;

  const productItemIds = orderItems?.map((item: any) => item.product);

  await CartModel.findOneAndUpdate(
    { sessionId },
    {
      $pull: {
        cartItem: { productId: { $in: productItemIds } },
      },
    },
    { new: true }
  );

  const emailPayload = {
    email: secret.smtpMail!,
    subject: "New Order Notification",
    templete: "orderConfirmation.ejs",
    data: order,
  };

  await sendMails(emailPayload);

  res.status(201).json({
    success: true,
    message: "Order Plased successfull",
    order,
  });
});

//get single order
export const getSignleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if id is empty or invalid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return errorMessage(res, 400, "Invalid order ID");
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Find order without populating the user field
  const order = await OrderModel.findById(objectId);

  if (!order) {
    return errorMessage(res, 404, "Order not found");
  }

  // Check if the user field is present
  if (order?.user) {
    await order.populate("user", "fullName email");
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
    userOrders = await OrderModel.find({ user: userId })
      .limit(15)
      .sort({ createdAt: -1 });
  } else {
    //get order id from cookie
    const cookies = req.cookies;
    const ordersId = Object.keys(cookies).filter((value) => {
      return value.startsWith("orders");
    });

    const orderPromises = ordersId.map(async (value) => {
      const orderId = value.split("-")[1];
      return OrderModel.findOne({ orderId }).limit(15).sort({ createdAt: -1 });
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
  const userId = res.locals.user?._id;

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

  if (orderStatus === "Delivered" && order) {
    //update stock and sold
    order.orderItems.map(async (value) => {
      await updateProductStockSold(value.product.toString(), value.quantity);
    });

    //update user review counter
    order.orderItems?.forEach(async (value) => {
      await updateReviewInfo(
        value?.product.toString(),
        order?.user?.toString()!
      );
    });

    //update deliveredAt
    if (!order.deliveredAt) {
      order.deliveredAt = new Date();
    } else {
      order.deliveredAt = new Date(Date.now());
    }
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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 15;
  const orderStatus = req.query.orderStatus || "";

  const filter: any = {};

  if (orderStatus) {
    filter.orderStatus = orderStatus;
  }

  const orders = await OrderModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    errorMessage(res, 404, "Orders not found");
    return;
  }

  const countOrders = await OrderModel.countDocuments(filter);
  const totalPage = Math.ceil(countOrders / limit);

  let totalOrders = {
    totalAmount: 0,
    numOfOrders: orders?.length,
  };
  let totalPandingOrder = {
    totalAmount: 0,
    numOfOrders: 0,
  };
  let totalDeliveredOrder = {
    totalAmount: 0,
    numOfOrders: 0,
  };
  let totalCancelledOrder = {
    totalAmount: 0,
    numOfOrders: 0,
  };

  orders.forEach((value) => {
    totalOrders.totalAmount += value.totalAmount;
    if (value?.orderStatus === "Pending") {
      totalPandingOrder.numOfOrders += 1;
      totalPandingOrder.totalAmount += value?.totalAmount;
    } else if (value?.orderStatus === "Delivered") {
      totalDeliveredOrder.numOfOrders += 1;
      totalDeliveredOrder.totalAmount += value?.totalAmount;
    } else if (value?.orderStatus === "Cancelled") {
      totalCancelledOrder.numOfOrders += 1;
      totalCancelledOrder.totalAmount += value?.totalAmount;
    }
  });

  res.status(200).json({
    success: true,
    message: "Your all order here",
    orderSummery: {
      totalOrders,
      totalPandingOrder,
      totalDeliveredOrder,
      totalCancelledOrder,
    },
    pagination: {
      numOfOrders: countOrders,
      totalPage: totalPage,
      currentPage: page,
      nextPage: page < totalPage ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
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

// get seales report
export const getSealesReport = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1);

  const yearlySales = await OrderModel.aggregate([
    {
      $match: {
        deliveredAt: { $gte: startOfYear, $lt: endOfYear },
        orderStatus: "Delivered",
      },
    },
    {
      $group: {
        _id: { month: { $month: "$deliveredAt" } },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const monthSales = Array.from({ length: 12 }, (_, monthIndex) => {
    const totalMonth = yearlySales?.find(
      (item) => item?._id?.month === monthIndex + 1
    );

    return {
      name: new Date(currentDate.getFullYear(), monthIndex, 1).toLocaleString(
        "en-us",
        { month: "long" }
      ),
      total: totalMonth ? totalMonth.totalAmount : 0,
    };
  });

  res.status(200).json({
    success: true,
    monthSales,
  });
});

export const getOrderStatus = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const startMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const orders = await OrderModel.find({
    createdAt: { $gte: startMonth, $lte: endMonth },
  });

  if (!orders) {
    errorMessage(res, 404, "Orders not found");
  }

  const orderSummary = {
    totalPandingOrder: 0,
    totalDeliveredOrder: 0,
    totalCancelledOrder: 0,
    totalShippedOrder: 0,
    totalProcessingOrder: 0,
  };

  orders.forEach((order) => {
    switch (order.orderStatus) {
      case "Pending":
        orderSummary.totalPandingOrder++;
        break;
      case "Delivered":
        orderSummary.totalDeliveredOrder++;
        break;
      case "Cancelled":
        orderSummary.totalCancelledOrder++;
        break;
      case "Processing":
        orderSummary.totalProcessingOrder++;
        break;
      case "Shipped":
        orderSummary.totalShippedOrder++;
        break;
      default:
        break;
    }
  });

  res.status(200).json({
    success: true,
    orderSummary,
  });
});
