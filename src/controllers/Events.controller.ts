import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../types/requests/AuthRequest";
import { newEventValidate } from "../validations/Event.validate";
// import { EventAttributes } from "../types/Events.types"
import Events from "../models/Events.model";
import { createTicketValidate } from "../validations/TicketType.validate";
import TicketType from "../models/TicketType.model";
export const newEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Joi Validation
    const { error } = newEventValidate.validate(req.body);
    const organizerId = (req as AuthRequest).user.id!;

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { description, endDate, location, startDate, title } = req.body;

    //JWT already checks if organizer exists
    await Events.create({
      description,
      endDate,
      location,
      organizerId,
      title,
      startDate,
      isPublished: false,
    });

    res.status(201).send({
      message:
        "Event created successfully. Event is not yet visible to others until you publish",
    });
  } catch (error) {
    next(error);
  }
};

export const allEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizerId = (req as AuthRequest).user.id!;

    const allEvents = await Events.findAll({
      where: { organizerId },
      order: ["createdAt", "DESC"],
    });

    res
      .status(200)
      .send({ message: "All events retrieved successfully", data: allEvents });
  } catch (error) {
    next(error);
  }
};

export const editEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;

    //Joi validation, -> use the same payload as creating an event

    const { error } = newEventValidate.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { title, description, location, startDate, endDate } = req.body;

    //Check if the event exists
    const eventExists = await Events.findOne({
      where: { organizerId: user.id, id },
    });

    if (!eventExists) {
      return res.status(400).send({ message: "Event not found." });
    }

    //Updating the records
    eventExists.title = title;
    eventExists.description = description;
    eventExists.location = location;
    eventExists.startDate = startDate;
    eventExists.endDate = endDate;

    const updatedRecord = await eventExists.save();

    res.status(200).send({
      message: "Event Details updated successfully!",
      details: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const publishEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;

    //Check if the event exists
    const eventExists = await Events.findOne({
      where: { organizerId: user.id, id },
    });

    if (!eventExists) {
      return res.status(400).send({ message: "Event not found." });
    }

    if (eventExists.isPublished) {
      return res
        .status(400)
        .send({ message: "Event has been published already." });
    }

    eventExists.isPublished = true;
    await eventExists.save();

    res.status(200).send({
      message: "Event has been published succesfully",
      details: eventExists,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    //Check if event exists
    const eventExists = await Events.findOne({where:{id},include:[{model:TicketType,as:"ticketTypes"}]});

    if (!eventExists) {
      return res.status(400).send({ message: "Event not found" });
    }


    res
      .status(200)
      .send({
        message: "Event details fetched",
        details: eventExists,
        
      });
  } catch (error) {
    next(error);
  }
};

export const createEventTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    //Joi validation
    const { error } = createTicketValidate.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { name, price, quantity } = req.body;

    //Check if event exists
    const eventExists = await Events.findByPk(id);
    if (!eventExists) {
      return res.status(400).send({ message: "Event not found" });
    }

    //Check if ticket type exist -> by ticket name
    const ticketTypeExists = await TicketType.findOne({ where: { name } });
    if (ticketTypeExists) {
      return res
        .status(400)
        .send({ message: `Ticket type:${name} already exists.` });
    }

    const ticket = await TicketType.create({
      eventId: eventExists?.id!,
      name,
      price,
      quantity,
      sold: 0,
    });

    res.status(201).send({
      message: `Ticket for ${eventExists?.title} created successfully`,
      details: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    //Check if event exists
    const eventExists = await Events.findByPk(id);
    if (!eventExists) {
      return res.status(400).send({ message: "Event not found" });
    }

    //Check if ticket type exist -> by ticket name
    const tickets = await TicketType.findAll({
      where: { eventId: eventExists.id },
      order: [["createdAt", "DESC"]], 
    });

    res.status(200).send({
      message: `Tickets for ${eventExists?.title} fetched successfully`,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};
