import SequelizeConfig from "../db/config"
import { DataTypes } from "sequelize"
import { TicketInstance } from "../types/Tickets.types"


const Tickets = SequelizeConfig.define<TicketInstance>("tickets",{

    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    orderId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    ticketTypeId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    qrCode:{
        type:DataTypes.STRING, ///the QR code image is going to be saved as a blob or url
        allowNull:true
    }
    
})
export default Tickets