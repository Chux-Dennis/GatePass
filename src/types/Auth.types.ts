import { Model } from "sequelize"
export interface UserAttributes {
    id?:string,
    email:string,
    //Firstname and lastname should only be collected if it is a buyer signinig up
    firstname?:string, 
    lastname?:string,

    //Name should only be collected if it is an orgainzer signing up
    name?:string

    role:"Organizer" | "Buyer"

    password:string,
    isVerified?:boolean,
    deletedAt?:Date
}


export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export type SafeUser = Omit<UserAttributes,"password">