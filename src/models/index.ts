import SequelizeConfig from "../db/config"
export  const handleAssociations = async()=>{
    //This function would handle associations between tables


}

export const setUpDatabase = async()=>{

    try {
        await handleAssociations()
        
        await SequelizeConfig.sync()

    } catch (error:any) {
        throw new Error(`Error from setupDatabse function:",${error}`)
    }
    

}