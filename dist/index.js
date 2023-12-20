"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const secret_1 = __importDefault(require("./src/config/secret"));
const startServer = () => {
    try {
        app_1.app.listen(secret_1.default.PORT, () => {
            console.log(`Server is running at http://localhost:${8000}`);
        });
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map