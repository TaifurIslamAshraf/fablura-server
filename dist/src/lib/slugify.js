"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = void 0;
const slugify = (str) => {
    return str
        .replace(/[^\u0980-\u09FFa-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLocaleLowerCase();
};
exports.slugify = slugify;
//# sourceMappingURL=slugify.js.map