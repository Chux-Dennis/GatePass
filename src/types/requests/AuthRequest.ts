import { Request } from "express";
import { SafeUser } from "../Auth.types";

export interface AuthRequest extends Request {
    user:SafeUser
}