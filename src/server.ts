import app from "./app";
const PORT = 5000
import { setUpDatabase } from "./models";

setUpDatabase().then(()=>{

    app.listen(PORT,()=>{
        console.log(`Server running on localhost:${PORT}`)
    })
}).catch((err)=>{
    console.log("Error in syncing DB and starting server:",err);
    
})
