import type { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      details: error.flatten().fieldErrors
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
    details: env.NODE_ENV === "production" ? undefined : String(error)
  });
};
