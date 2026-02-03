import { Router } from "express";
const entryRoute = Router()
import Auth from "./Auth.routes";
import Events from "./Events.routes";
import Order from "./Order.routes";
import Webhook from "./Webhook.routes";

entryRoute.use("/auth",Auth)
entryRoute.use("/events",Events)
entryRoute.use("/order",Order)
entryRoute.use("/hooks",Webhook)

export default entryRoute