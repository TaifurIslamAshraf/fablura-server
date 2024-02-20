"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    image: {
        type: String,
        required: true,
    },
});
const CustomerModel = mongoose_1.default.model("customerReview", customerSchema);
exports.default = CustomerModel;
//# sourceMappingURL=customarReview.model.js.map