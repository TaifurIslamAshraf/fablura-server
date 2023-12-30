"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const secret_1 = __importDefault(require("../config/secret"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        validate: {
            validator: (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: "Enter a valid email",
        },
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "User Password is Required"],
        minlength: [6, "Password Must be at least 6 characters"],
        select: false,
    },
    isSocialAuth: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
    },
    address: {
        type: String,
        // required: [true, "Address is Required"],
    },
    phone: {
        type: String,
        // required: [true, "Phone number is required"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
}, { timestamps: true });
//hash pssword
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
//access token
userSchema.methods.accessToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id }, secret_1.default.accessTokenSecret, {
        expiresIn: "5m",
    });
};
//refresh token
userSchema.methods.refreshToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id }, secret_1.default.refreshTokenSecret, {
        expiresIn: "30d",
    });
};
//compare password
userSchema.methods.comparePassword = async function (entredPassword) {
    const isMatch = await bcryptjs_1.default.compare(entredPassword, this.password);
    return isMatch;
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map