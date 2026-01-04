// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? err.statusCode === 500
        ? "Internal Server Error"
        : err.message
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
