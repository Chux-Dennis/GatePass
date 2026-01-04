import { Sequelize as SQL } from "sequelize";
import dotenv from "dotenv"
dotenv.config({path:"../.env"})

const { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_HOST } = process.env;

const SequelizeConfig = new SQL(
  DB_NAME as string,
  DB_USERNAME as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST,
    dialect: "mysql",
    logging: false,
   
  }
);

export default SequelizeConfig;
