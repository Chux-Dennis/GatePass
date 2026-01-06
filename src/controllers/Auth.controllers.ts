import { UserAttributes } from "../types/Auth.types";
import jwt from "jsonwebtoken"
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import {
  validateLogin,
  validateNewBuyer,
  validateNewOrganizer,
  validateVerifyOTP,
} from "../validations/Auth.validate";
import { getOtpAndExpiry } from "../utils/otpandexpiry";
import User from "../models/User.model";
import UserTokens from "../models/UserTokens.model";
import { SendOTP } from "../mail/Auth.mail";


const JWT_SECRET = process.env.JWT_SECRET!




export const newOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Joi validation -> Organizer should not have firstname and lastname when signing up!!
  const role = "Organizer" as UserAttributes["role"]

  const { error } = validateNewOrganizer.validate(req.body);
  if (error) {
    return res.status(400).send({ message: `${error.details[0].message}` });
  }

  //Check if email and name is taken
  const { email, password, name } = req.body as UserAttributes;
  const confirmPassword = req.body.confirmPassword;
  const userFound = await User.findOne({ where: { email, name } });

  if (userFound) {
    res.status(400).send({ message: `Email and/or name is taken.` });
    return;
  }

  //Check if password and confirmPassword are the same
  if (password !== confirmPassword) {
    res
      .status(400)
      .send({ message: "password and confirmPassword do not match" });
    return;
  }

  // Hash password
  const hashedPass = await bcrypt.hash(password, 10);

  // Generate otp and expiry
  const OTPDuration: number = 10;
  const { expiry, otp } = getOtpAndExpiry(OTPDuration);

  //Create new user
  const newUser = await User.create({
    email,
    password: hashedPass,
    name,
    role: role,
    isVerified: false,
  });

  //Add new user token
  await UserTokens.create({
    token: otp,
    expiresAt: expiry,
    userId: newUser.id!,
    type: "verify_mail",
  });

  //Send mail
  await SendOTP("Glad to have you join us", email, otp, OTPDuration.toString());

  res
    .status(201)
    .send({
      message: "Registered Successfully, check your email for an OTP.",
      success: true,
    });
};

export const verifyOrganizersOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = "Organizer" as UserAttributes["role"]
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  const { error } = validateVerifyOTP.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  const { email, otp } = req.body;

  try {
    const foundUser = await User.findOne({
      where: { email, role: role },
    });

    // User exists?
    if (!foundUser) {
      res.status(400).send({ message: "Invalid email" });
      return;
    }

    // Already verified?
    if (foundUser.isVerified) {
      res.status(400).send({ message: "User is already verified" });
      return;
    }

    // Check tokens table
    const respectiveToken = await UserTokens.findOne({
      where: {
        userId: foundUser.id,
        type: "verify_mail",
      },
    });

    if (!respectiveToken) {
      res.status(400).send({ message: "User did not request for an OTP." });
      return;
    }

    // OTP expired?
    if (dayjs(respectiveToken.expiresAt).isBefore(dayjs())) {
      res.status(400).send({ message: "OTP has expired" });
      return;
    }

    // OTP matches?
    if (respectiveToken.token !== otp) {
      res.status(400).send({ message: "OTP is invalid." });
      return;
    }

    //Delete that record
    await respectiveToken.destroy();
    foundUser.isVerified = true;
    await foundUser.save();

    res
      .status(200)
      .send({
        message: "Account Verified Successfully,you can now login successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const requestOrganizerOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = "Organizer" as UserAttributes["role"]
  let otpDuration: number = 10;
  const { expiry, otp } = getOtpAndExpiry(otpDuration);

  const { email } = req.body;

  if(!email || !req.body){
    res.status(400).send({message:"Invalid payload"})
    return
  }

  try {
    //Check if organizer has an existing otp
    const userExists = await User.findOne({
      where: { email, role: role },
    });

    if (!userExists) {
      res.status(400).send({ message: "User records not found." });
    }

    const existingOTP = await UserTokens.findOne({
      where: { userId: userExists!.id },
    });

    if (!existingOTP) {
      return res
        .status(400)
        .send({ message: "User has made no initial request for an OTP" });
    }

    existingOTP!.token = otp;
    existingOTP!.type = "verify_mail";
    existingOTP!.expiresAt = expiry;

    await existingOTP.save();

    //Send mail
    await SendOTP("We resent you the OTP", email, otp, otpDuration.toString());

    res.status(200).send({ message: "OTP resent to your mail." });
  } catch (error) {
    next(error);
  }
};


export const loginOrganizer = async(req:Request,res:Response,next:NextFunction)=>{
  const role = "Organizer" as UserAttributes["role"]
  //Joi validation

  const {error} = validateLogin.validate(req.body)
  if(error){
    return res.status(400).send({message:error.details[0].message})
  }

  const {email,password} = req.body

  try {

    //Check if email exists 
    const userWithEmailExists = await User.findOne({where:{email,role}}) 

    if(!userWithEmailExists){
      res.status(400).send({message:"User not found"})
    }

    //Check if password is right
    const passwordMatches =  await bcrypt.compare(password,userWithEmailExists?.password!)

    if(!passwordMatches){
      res.status(400).send({message:"Invalid Password"})
    }

    const {password:pw,...userwopass} = userWithEmailExists!.toJSON()

    // Generate JWT Token 
    const token = jwt.sign(userwopass,JWT_SECRET,{
      expiresIn:"24h"
    })


    res.status(200).send({message:"Successfully logged in",token})
    
  } catch (error) {
    next(error)
  }

}


// ================= BUYER CONTROLLERS =======================


export const newBuyer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Joi validation -> Organizer should not have firstname and lastname when signing up!!
  const role = "Buyer" as UserAttributes["role"]

  const { error } = validateNewBuyer.validate(req.body);
  if (error) {
    return res.status(400).send({ message: `${error.details[0].message}` });
  }

  //Check if email and name is taken
  const { email, password, name } = req.body as UserAttributes;
  const confirmPassword = req.body.confirmPassword;
  const userFound = await User.findOne({ where: { email, name } });

  if (userFound) {
    res.status(400).send({ message: `Email and/or name is taken.` });
    return;
  }

  //Check if password and confirmPassword are the same
  if (password !== confirmPassword) {
    res
      .status(400)
      .send({ message: "password and confirmPassword do not match" });
    return;
  }

  // Hash password
  const hashedPass = await bcrypt.hash(password, 10);

  // Generate otp and expiry
  const OTPDuration: number = 10;
  const { expiry, otp } = getOtpAndExpiry(OTPDuration);

  //Create new user
  const newUser = await User.create({
    email,
    password: hashedPass,
    name,
    role: role,
    isVerified: false,
  });

  //Add new user token
  await UserTokens.create({
    token: otp,
    expiresAt: expiry,
    userId: newUser.id!,
    type: "verify_mail",
  });

  //Send mail
  await SendOTP("Glad to have you join us", email, otp, OTPDuration.toString());

  res
    .status(201)
    .send({
      message: "Registered Successfully, check your email for an OTP.",
      success: true,
    });
};


export const verifyBuyersOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = "Buyer" as UserAttributes["role"]
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  const { error } = validateVerifyOTP.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  const { email, otp } = req.body;

  try {
    const foundUser = await User.findOne({
      where: { email, role: role },
    });

    // User exists?
    if (!foundUser) {
      res.status(400).send({ message: "Invalid email" });
      return;
    }

    // Already verified?
    if (foundUser.isVerified) {
      res.status(400).send({ message: "User is already verified" });
      return;
    }

    // Check tokens table
    const respectiveToken = await UserTokens.findOne({
      where: {
        userId: foundUser.id,
        type: "verify_mail",
      },
    });

    if (!respectiveToken) {
      res.status(400).send({ message: "User did not request for an OTP." });
      return;
    }

    // OTP expired?
    if (dayjs(respectiveToken.expiresAt).isBefore(dayjs())) {
      res.status(400).send({ message: "OTP has expired" });
      return;
    }

    // OTP matches?
    if (respectiveToken.token !== otp) {
      res.status(400).send({ message: "OTP is invalid." });
      return;
    }

    //Delete that record
    await respectiveToken.destroy();
    foundUser.isVerified = true;
    await foundUser.save();

    res
      .status(200)
      .send({
        message: "Account Verified Successfully,you can now login successfully",
      });
  } catch (error) {
    next(error);
  }
};


export const requestBuyerOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = "Buyer" as UserAttributes["role"]
  let otpDuration: number = 10;
  const { expiry, otp } = getOtpAndExpiry(otpDuration);

  const { email } = req.body;

  if(!email || !req.body){
    res.status(400).send({message:"Invalid payload"})
    return
  }

  try {
    //Check if organizer has an existing otp
    const userExists = await User.findOne({
      where: { email, role: role },
    });

    if (!userExists) {
      res.status(400).send({ message: "User records not found." });
    }

    const existingOTP = await UserTokens.findOne({
      where: { userId: userExists!.id },
    });

    if (!existingOTP) {
      return res
        .status(400)
        .send({ message: "User has made no initial request for an OTP" });
    }

    existingOTP!.token = otp;
    existingOTP!.type = "verify_mail";
    existingOTP!.expiresAt = expiry;

    await existingOTP.save();

    //Send mail
    await SendOTP("We resent you the OTP", email, otp, otpDuration.toString());

    res.status(200).send({ message: "OTP resent to your mail." });
  } catch (error) {
    next(error);
  }
};


export const loginBuyer = async(req:Request,res:Response,next:NextFunction)=>{
  const role = "Buyer" as UserAttributes["role"]
  //Joi validation

  const {error} = validateLogin.validate(req.body)
  if(error){
    return res.status(400).send({message:error.details[0].message})
  }

  const {email,password} = req.body

  try {

    //Check if email exists 
    const userWithEmailExists = await User.findOne({where:{email,role}}) 

    if(!userWithEmailExists){
      res.status(400).send({message:"User not found"})
    }

    //Check if password is right
    const passwordMatches =  await bcrypt.compare(password,userWithEmailExists?.password!)

    if(!passwordMatches){
      res.status(400).send({message:"Invalid Password"})
    }

    const {password:pw,...userwopass} = userWithEmailExists!.toJSON()

    // Generate JWT Token 
    const token = jwt.sign(userwopass,JWT_SECRET,{
      expiresIn:"24h"
    })


    res.status(200).send({message:"Successfully logged in",token})
    
  } catch (error) {
    next(error)
  }

}
