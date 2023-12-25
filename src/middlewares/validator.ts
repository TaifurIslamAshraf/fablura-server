import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

export const validator = (schema: AnyZodObject | ZodEffects<AnyZodObject>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const errorMessage = error.errors.map((err: any) => ({
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
