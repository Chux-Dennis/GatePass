import SequelizeConfig from "../db/config"
import User from "./User.model";
import Event from "./Events.model";
// import { Ticket } from "../models/ticket.model";
import Ticket from "./Ticket.model";
import Order from "./Order.model";
import TicketType from "./TicketType.model";

export const handleAssociations = async () => {
  // ----------------------------
  // Organizer(User) -> Event
  // ----------------------------
  User.hasMany(Event, { foreignKey: "organizerId", as: "organizedEvents" });
  Event.belongsTo(User, { foreignKey: "organizerId", as: "organizer" });

  // ----------------------------
  // Event -> TicketType
  // ----------------------------
  Event.hasMany(TicketType, { foreignKey: "eventId", as: "ticketTypes" });
  TicketType.belongsTo(Event, { foreignKey: "eventId", as: "event" });

  // ----------------------------
  //  TicketType -> Ticket
  // ----------------------------
  TicketType.hasMany(Ticket, { foreignKey: "ticketTypeId", as: "tickets" });
  Ticket.belongsTo(TicketType, { foreignKey: "ticketTypeId", as: "ticketType" });

  // ----------------------------
  // Buyer(User) -> Order
  // ----------------------------
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "buyer" });

  // ----------------------------
  // 5️ Order -> Ticket
  // ----------------------------
  Order.hasMany(Ticket, { foreignKey: "orderId", as: "tickets" });
  Ticket.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  // Optional: Ticket belongs to Event (via TicketType)
  // Can help for direct queries without joining TicketType every time
  Event.hasMany(Ticket, { foreignKey: "eventId", as: "tickets" });
  Ticket.belongsTo(Event, { foreignKey: "eventId", as: "event" });
};

export const setUpDatabase = async()=>{

    try {
        await handleAssociations()
        
        await SequelizeConfig.sync()

    } catch (error:any) {
        throw new Error(`Error from setupDatabse function:",${error}`)
    }
    

}