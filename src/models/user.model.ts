import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Model, Schema, model } from "mongoose";

import { IUser } from "../../types/user";
import secret from "../config/secret";

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      validate: {
        validator: (v: string) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
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
      required: [true, "Address is Required"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

//hash pssword
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//access token
userSchema.methods.accessToken = function () {
  return jwt.sign({ _id: this._id }, secret.accessTokenSecret as string, {
    expiresIn: "5m",
  });
};

//refresh token
userSchema.methods.refreshToken = function () {
  return jwt.sign({ _id: this._id }, secret.refreshTokenSecret as string, {
    expiresIn: "30d",
  });
};

//compare password
userSchema.methods.comparePassword = async function (
  entredPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(entredPassword, this.password);
  return isMatch;
};

const UserModel: Model<IUser> = model("User", userSchema);
export default UserModel;
