import { Router } from "express";
import { newOrganizer,verifyOrganizersOTP as VOOTP ,requestOrganizerOTP as ROOTP,loginOrganizer} from "../controllers/Auth.controllers";
import { newBuyer,loginBuyer,requestBuyerOTP,verifyBuyersOTP } from "../controllers/Auth.controllers";
const Auth = Router()

// === ORGANIZER ROUTES === 
Auth.post("/organizer/new",newOrganizer)
Auth.post("/organizer/verify",VOOTP)
Auth.post("/organizer/request-otp",ROOTP)
Auth.post("/organizer/login",loginOrganizer)


// === BUYER ROUTES === 
Auth.post("/buyer/new",newBuyer)
Auth.post("/buyer/verify",verifyBuyersOTP)
Auth.post("/buyer/request-otp",requestBuyerOTP)
Auth.post("/buyer/login",loginBuyer)



export default Auth