"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = exports.errorMessage = void 0;
const errorMessage = (res, statusCode, message) => {
    res.status(statusCode);
    throw new Error(message);
};
exports.errorMessage = errorMessage;
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    //mongoose not found error
    if (err.name === "CastError" && err.kind === "ObjectId") {
        console.log("orders", err);
        statusCode = 404;
        message = "Resource not found !";
    }
    //mongoose duplicate key error
    if (err.code === 1100) {
        statusCode = 400;
        message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    }
    //wrong jwt error
    if (err.name === "JsonWebTokenError") {
        statusCode = 400;
        message = "Json web token is invalid";
    }
    //jwt expired error
    if (err.name === "TokenExpiredError") {
        statusCode = 400;
        message = "Your Token is Expired. Try Again";
    }
    // //multer error
    // if (err instanceof multer.MulterError) {
    //   statusCode = 500;
    //   message = "There was an upload error!";
    // }
    res.status(statusCode).json({
        succss: false,
        message,
        // stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map