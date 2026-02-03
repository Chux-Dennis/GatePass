import { NextFunction, Request, Response } from "express";
import { calculateAmountAfterPaystackCharge } from "../utils/calculateAmount";
import { generateRef } from "../utils/generateRef";
import { PAYSTACK_CHARGE_RATE } from "../constants/charge";
import Events from "../models/Events.model";
import TicketType from "../models/TicketType.model";
import Ticket from "../models/Ticket.model";
import Order from "../models/Order.model";
import db from "../db/config";
import axios from "axios";
import { createOrderSchema } from "../validations/Order.validate";
import { AuthRequest } from "../types/requests/AuthRequest";

const { PAYSTACK_PRIVATE_KEY } = process.env;

export const ticketsOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { eventId } = req.params;
  const ref = generateRef()

  try {
    // -------------------------------
    // 1️⃣ Joi validation
    // -------------------------------
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { tickets } = req.body;

    // -------------------------------
    // 2️⃣ Check if event exists
    // -------------------------------
    const eventExists = await Events.findByPk(eventId);
    if (!eventExists) {
      return res.status(400).json({ message: "Event not found." });
    }

    // -------------------------------
    // 3️⃣ Check for duplicate ticketTypeId in payload
    // -------------------------------
    const ticketTypeIds = tickets.map((t: any) => t.ticketTypeId);
    const uniqueTicketTypeIds = Array.from(new Set(ticketTypeIds));
    if (uniqueTicketTypeIds.length !== ticketTypeIds.length) {
      return res.status(400).json({ message: "Duplicate ticketTypeId in request." });
    }

    // -------------------------------
    // 4️⃣ Start transaction
    // -------------------------------
    const trx = await db.transaction();

    try {
      // Calculate total amount
      let totalAmount = 0;
      let finalAmount = 0;

      // Validate ticketType and check availability
      const ticketRecords: any[] = [];

      for (const item of tickets) {
        const ticketType = await TicketType.findOne({
          where: { id: item.ticketTypeId, eventId },
          lock: true, // row-level lock to prevent race conditions
          transaction: trx,
        });

        if (!ticketType) {
          await trx.rollback();
          return res.status(400).json({ message: `TicketType ${item.ticketTypeId} not found for this event.` });
        }

        //If quantity left is not enough
        // if ((ticketType.quantity - ticketType.sold) < item.quantity) {
        //   await trx.rollback();
        //   return res.status(400).json({ message: `Not enough tickets for ${ticketType.name}.` });
        // }

        // Update sold quantity
        ticketType.sold += item.quantity;
        await ticketType.save({ transaction: trx });

        // Sum total amount
        totalAmount += ticketType.price * item.quantity;
        
        //Calculate final amount after paystack charge
        let charge =  (Number(PAYSTACK_CHARGE_RATE) / 100) * totalAmount
        finalAmount += totalAmount + charge




        // Prepare ticket entries
        for (let i = 0; i < item.quantity; i++) {
          ticketRecords.push({ ticketTypeId: item.ticketTypeId });
        }
      }

      // -------------------------------
      // 5️⃣ Create Order (status = pending)
      // -------------------------------
      const order = await Order.create(
        {
          userId: (req as AuthRequest).user?.id!, // assumes you attach authenticated user
          status: "pending",
          totalAmount,
          ref
        },
        { transaction: trx }
      );

      // Associate tickets with order
      for (const ticket of ticketRecords) {
        ticket.orderId = order.id;
      }
      await Ticket.bulkCreate(ticketRecords, { transaction: trx });

      // -------------------------------
      // 6️⃣ Commit transaction
      // -------------------------------
      await trx.commit();

      // -------------------------------
      // 7️⃣ Initiate Paystack checkout
      // -------------------------------
      const paystackResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: (req as AuthRequest).user?.email,
          amount: calculateAmountAfterPaystackCharge(totalAmount) * 100, // Paystack expects amount in kobo
          currency: "NGN",
          ref,
          // callback_url: `https://yourdomain.com/paystack/callback/${order.id}`,
          metadata: { orderId: order.id },
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_PRIVATE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json({
        message: "Order created successfully. Complete payment to confirm.",
        orderId: order.id,
        ref,
        checkoutUrl: paystackResponse.data.data.authorization_url,
      });
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};
