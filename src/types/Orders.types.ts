import { Model } from "sequelize";

export interface OrderAttributes {
  id?: string;
  userId: string;
  status: "pending" | "cancelled" | "paid";
  totalAmount: number;
  ref:string;
  paidAt?:Date
}

export interface OrderInstance
  extends Model<OrderAttributes>,
    OrderAttributes {}
