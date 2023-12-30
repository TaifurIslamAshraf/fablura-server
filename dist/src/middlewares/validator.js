"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const validator = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            const errorMessage = error.errors.map((err) => ({
                code: err.code,
                expected: err.expected,
                recevied: err.recevied,
                path: err.path.join("."),
                message: err.message,
            }));
            res.status(400).json({ error: errorMessage });
        }
    };
};
exports.validator = validator;
//# sourceMappingURL=validator.js.map