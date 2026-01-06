import { Router } from "express";
const entryRoute = Router()
import Auth from "./Auth.routes";
import Events from "./Events.routes";

entryRoute.use("/auth",Auth)
entryRoute.use("/events",Events)

export default entryRoute