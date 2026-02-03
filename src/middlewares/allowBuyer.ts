import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserAttributes } from "../types/Auth.types";

interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

export const allowBuyer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];
  

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    let role = decoded.role as UserAttributes["role"]

    if (role !== "Buyer") {
      return res.status(403).json({
        message: "Access denied. Buyer role required.",
      });
    }

    // attach user to request for downstream usage
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};



