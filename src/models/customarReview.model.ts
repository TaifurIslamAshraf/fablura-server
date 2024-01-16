import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const CustomerModel = mongoose.model("customerReview", customerSchema);
export default CustomerModel;
