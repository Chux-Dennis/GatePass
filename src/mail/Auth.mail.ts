
import { sendMail } from "../services/nodemailer.services"
import { generateOTPEmailHTML } from "../templates/Auth.templates"
// import { generateOTPEmailHTML,generateOTPForForgotPassword } from "../templates/Auth.templates"
export const SendOTP = async(messageTitle:string,email:string,otp:string,expiry:string)=>{
 await sendMail({
    to:email,
    subject:messageTitle,
    from:process.env.APP_EMAIL,
    html:generateOTPEmailHTML(otp,expiry)
 })
}