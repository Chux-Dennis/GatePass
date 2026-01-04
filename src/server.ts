import express from "express"
import SequelizeConfig from "./db/config"
import entryRoute from "./routes"
import dotenv from "dotenv"
import morgan = require("morgan")
import { errorHandler } from "./middlewares/errorHandler"
dotenv.config({path:"../.env"})
const app = express()
const PORT = 5000

//Middleware that allows the parsing of payload when making request
app.use(express.json())

// For logging requests 
app.use(morgan("dev"))

//Middleware that allows for global error handling
app.use(errorHandler);

const baseURL =`/api/v1`
app.use(`${baseURL}`, entryRoute);

SequelizeConfig.sync().then(()=>{

    app.listen(PORT,()=>{
        console.log(`Server running on localhost:${PORT}`)
    })
}).catch((err)=>{
    console.log("Error in syncing DB and starting server:",err);
    
})

