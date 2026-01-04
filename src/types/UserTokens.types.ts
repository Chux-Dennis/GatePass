import { Model } from "sequelize";

export interface UserTokensAttributes {
    id?:string,
    userId:string,
    token:string,
    type:"verify_mail" | "forgot_password" | "reset_password",
    expiresAt:Date

}

export interface UserTokensInstance
  extends Model<UserTokensAttributes>,
    UserTokensAttributes {}
