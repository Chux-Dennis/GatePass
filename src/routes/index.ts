import { Router } from "express";
const entryRoute = Router()
import Auth from "./Auth.routes";


entryRoute.use("/auth",Auth)

export default entryRoute