import { Router } from "express";
import { checkToken } from "../middlewares/checkToken";
import { allowBuyer } from "../middlewares/allowBuyer";
import { ticketsOrder } from "../controllers/Order.controllers";
const Order = Router()

Order.post("/pay/:eventId",checkToken,allowBuyer,ticketsOrder)

export default Order