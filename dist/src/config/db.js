"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const secret_1 = __importDefault(require("./secret"));
const dbConnection = () => {
    mongoose_1.default
        .connect(secret_1.default.dbUri)
        .then(() => {
        console.log(`Database connect successfull`);
    })
        .catch((err) => {
        console.log(err);
        process.exit(1);
    });
};
exports.dbConnection = dbConnection;
//# sourceMappingURL=db.js.map