import type { Request, Response, NextFunction } from "express";

import type { ZodSchema } from "zod";

declare module "express" {
  interface Request {
    validatedBody?: unknown;
  }
}

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const bodyResult = schema.safeParse(req.body);

    if (bodyResult.success) {
      req.validatedBody = bodyResult.data;

      next();

      return;
    }

    const paramsResult = schema.safeParse({ params: req.params, query: req.query });

    if (paramsResult.success) {
      req.validatedBody = paramsResult.data;

      next();

      return;
    }

    return res.status(400).json({
      success: false,

      message: "Validation failed",

      errors: bodyResult.error.errors
    });
  };
