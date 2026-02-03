import { Model } from "sequelize"

export interface TicketAttributes {
    id?:string
orderId:string
ticketTypeId:string
qrCode:string
}

export interface TicketInstance extends Model<TicketAttributes>,TicketAttributes{}