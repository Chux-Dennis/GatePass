import { Router } from "express";
import { newEvents ,allEvents,editEvent, getOneEvent,createEventTicket,publishEvent,getEventTicket} from "../controllers/Events.controller";
import { checkToken } from "../middlewares/checkToken";
import { allowOrganizer } from "../middlewares/allowOrganizer";

const Events = Router()

// NOTE!!: Only users that have a role of organizer can create events , therefore this route is protected

Events.post("/new",checkToken,allowOrganizer,newEvents)
Events.get("/all",checkToken,allowOrganizer,allEvents)
Events.get("/details/:id",checkToken,allowOrganizer,getOneEvent)
Events.patch("/edit/:id",checkToken,allowOrganizer,editEvent)
Events.post("/publish/:id",checkToken,allowOrganizer,publishEvent)

//You cannot delete/unpublish an event, if someone has already tickets for that even 

// === Tickets Routes === 
Events.post("/:id/tickets",checkToken,allowOrganizer,createEventTicket)
Events.get("/:id/tickets",checkToken,allowOrganizer,getEventTicket)


export default Events