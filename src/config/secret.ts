import dotenv from "dotenv";

dotenv.config();

const secret = {
  serverUrl: process.env.SERVER_URL,
  clientUrl: process.env.CLIENT_URL,

  PORT: process.env.PORT,
  dbUri: process.env.DB_URI as string,

  forgotPasswordSecret: process.env.FORGOT_PASSWORD_SECRET as string,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  mailVarificationTokenSecret: process.env
    .MAIL_VARIFICATION_TOKEN_SECRET as string,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE,

  smtpMail: process.env.SMTP_MAIL,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpService: process.env.SMTP_SERVICE,
  smtpPass: process.env.SMTP_PASS,
};

export default secret;
