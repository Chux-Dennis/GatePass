import SequelizeConfig from "../db/config";
import { DataTypes } from "sequelize";
import { UserInstance } from "../types/Auth.types";

const User = SequelizeConfig.define<UserInstance>(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("Organizer", "Buyer"),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);
export default User;
