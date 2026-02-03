import SequelizeConfig from "../db/config";
import { DataTypes } from "sequelize";
import { OrderInstance } from "../types/Orders.types";

const Orders = SequelizeConfig.define<OrderInstance>("orders", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "cancelled", "paid"),
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ref: { type: DataTypes.STRING, allowNull: false },
  paidAt:{
    type:DataTypes.DATE,
    allowNull:true
  }
});

export default Orders;
