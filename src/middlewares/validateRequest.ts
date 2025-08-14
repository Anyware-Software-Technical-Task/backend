import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };
