import Joi from "joi";


export const validateNewOrganizer = Joi.object<any>({
  name:Joi.string().max(50).required(),
  email:Joi.string().email().required(),
  password:Joi.string().min(8).max(50).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])")).required(),
  confirmPassword:Joi.string().min(8).max(50).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])")).required()
}).min(1).required()

export const validateNewBuyer = Joi.object<any>({
  name:Joi.string().max(50).required(),
  firstname:Joi.string().max(50).required(),
  lastname:Joi.string().max(50).required(),
  email:Joi.string().email().required(),
  password:Joi.string().min(8).max(50).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])")).required(),
  confirmPassword:Joi.string().min(8).max(50).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])")).required()
}).min(1).required()

export const validateVerifyOTP = Joi.object({
    email: Joi.string().email().required(),
    otp:Joi.string().required(),
}).min(1).required()

export const validateLogin = Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().min(8).max(50).required()
})