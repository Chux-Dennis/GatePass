import DataTypesConfig from "../db/config";
import { DataTypes } from "sequelize";
import { UserTokensInstance } from "../types/UserTokens.types";

const UserTokens = DataTypesConfig.define<UserTokensInstance>(
  "user_tokens",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
);


export default UserTokens