import mongoose from "mongoose";
import secret from "./secret";

export const dbConnection = () => {
  mongoose
    .connect(secret.dbUri as string)
    .then(() => {
      console.log(`Database connect successfull`);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
