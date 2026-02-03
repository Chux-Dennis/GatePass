import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import Order from "../models/Order.model";
// import Ticket from "../models/Ticket.model";

export const paystackWebhook = async (req: Request, res: Response,next:NextFunction) => {
  try {
    // ---------------------------------
    // 1️⃣ Verify Paystack signature
    // ---------------------------------
    const paystackSignature = req.headers["x-paystack-signature"] as string;

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_PRIVATE_KEY as string)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== paystackSignature) {
      return res.status(401).send({message:"Invalid signature"}); // invalid signature
    }

    const event = req.body;

    // ---------------------------------
    // 2️⃣ Handle only successful charges
    // ---------------------------------
    if (event.event !== "charge.success") {
      console.log("Event.event was not charge.sucess");
      
      return res.status(400).send({message:"Trx not successfull",event:event.event});
    }

    const reference = event.data.reference;
    let orderId = event.data.metadata.orderId


    const order = await Order.findOne({ where: { id:orderId } });

    if (!order) {
      // Order does not exist (ignore safely)
      console.log("Order was not found");
      console.log("Reference:",reference);
      console.log(event.data);
      
      return res.sendStatus(400);
    }

  
    if (order.status === "paid") {
      return res.status(400).send({message:"Ticket status is already 'paid' "});
    }

 
    order.status = "paid";
    order.paidAt = new Date();
    await order.save();

 

    // TODO
    // - Generate QR codes
    // - Send email with tickets
    // - Notify frontend via websocket

    return res.status(200).send({message:`Order ref:${reference} duly received.`});
  } catch (error) {
    // console.error("Paystack Webhook Error:", error);
    next(error)
  }
};
