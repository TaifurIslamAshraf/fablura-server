import { IActivationInfo } from "../../types/user";
import secret from "../config/secret";
import { genarateJwtToken } from "./genarateJwtToken";

interface IActivation {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: IActivationInfo): IActivation => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = genarateJwtToken({
    payload: { user, activationCode },
    jwtSecret: secret.mailVarificationTokenSecret,
    expireIn: "5m",
  });

  return { activationCode, token };
};
