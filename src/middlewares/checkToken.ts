import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { SafeUser } from "../types/Auth.types";
const { JWT_SECRET } = process.env;

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,

        message: "No token provided.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      id: string;
      email:string;
      isAdmin: boolean;
    };

    const user = await User.findByPk(decoded.id);

    if(!user?.isVerified){
      res.status(400).send({message:"Forbidden Request , User is not verified."})
      return
    }

     (req as any).user = user as SafeUser
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(400).send({ message: "Expired token, try signing in again" });
    } else if (error instanceof JsonWebTokenError) {
      res.status(400).send({ message: "Token provided is invalid" });
    } else {
      res.status(400).send({ message: "Token provided is invalid/expired." });
    }
  }
};