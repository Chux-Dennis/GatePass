import { Router } from "express";
import { paystackWebhook } from "../controllers/Webhook.controller";

const Webhook = Router()

Webhook.post("/signify",paystackWebhook)

export default Webhook