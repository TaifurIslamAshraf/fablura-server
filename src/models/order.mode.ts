import mongoose, { Schema, model } from "mongoose";

export const orderSchema = new Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },
      fullName: {
        type: String,
        required: [true, "Full name is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },

    orderItems: [
      {
        productName: {
          type: String,
          required: [true, "Product name is required"],
        },
        colors: {
          type: String,  
          required: [true, "Product colors are required"],
        },
        size: {
          type: String,
          required: [true, "Product size are required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quentity is required"],
        },
        image: {
          type: String,
          required: [true, "Product image is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
      },
    ],

    orderNots: {
      type: String,
    },

    user: {
      type: String,
      ref: "User",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    orderId: {
      type: String,
      required: [true, "OrderId is required"],
    },

    paymentType: {
      type: String,
      required: [true, "Payment Type is required"],
    },

    itemsPrice: {
      type: Number,
      required: [true, "Items price is required"],
    },
    shippingPrice: {
      type: Number,
      required: [true, "Shipping price is required"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model("Order", orderSchema);
export default OrderModel;
