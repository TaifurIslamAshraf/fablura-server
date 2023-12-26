import jwt from "jsonwebtoken";

export const verifyJwtToken = (token: string, secret: string) => {
  const result = jwt.verify(token, secret);
  return result;
};
