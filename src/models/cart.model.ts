import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  selected: {
    type: Boolean,
    default: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    cartItem: [cartItemSchema],
    totalMainPrice: {
      type: Number,
      default: 0,
    },
    totalDiscountPrice: {
      type: Number,
      default: 0,
    },

    selectAll: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
