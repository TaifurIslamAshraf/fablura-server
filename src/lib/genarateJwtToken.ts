import jwt from "jsonwebtoken";

interface ITokenOptions {
  payload: object | string;
  jwtSecret: string;
  expireIn?: string;
}

export const genarateJwtToken = ({
  payload,
  jwtSecret,
  expireIn,
}: ITokenOptions) => {
  const token = jwt.sign(payload, jwtSecret, { expiresIn: expireIn });
  return token;
};
