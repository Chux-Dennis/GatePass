import { Router } from "express";
import { newOrganizer,verifyOrganizersOTP as VOOTP ,requestOrganizerOTP as ROOTP,loginOrganizer} from "../controllers/Auth.controllers";

const Auth = Router()

Auth.post("/organizer/new",newOrganizer)
Auth.post("/organizer/verify",VOOTP)
Auth.post("/organizer/request-otp",ROOTP)
Auth.post("/organizer/login",loginOrganizer)



export default Auth