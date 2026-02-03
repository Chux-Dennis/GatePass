import { Model } from "sequelize";

export interface TicketTypeAttributes {
  id?: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  // sold: boolean;

}

export interface TicketTypeInstance
  extends Model<TicketTypeAttributes>,
    TicketTypeAttributes {}
