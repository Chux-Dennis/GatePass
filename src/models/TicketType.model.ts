import SequelizeConfig from "../db/config";
import { DataTypes } from "sequelize";
import { TicketTypeInstance } from "../types/TicketType.types";

const TicketType = SequelizeConfig.define<TicketTypeInstance>("ticket_type",{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    eventId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    sold:{
   

          type:DataTypes.INTEGER,
      defaultValue:0
    }

})

export default TicketType   