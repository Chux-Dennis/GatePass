import Joi from "joi";

export const createTicketValidate = Joi.object({
    name:Joi.string().max(20).required()       ,
  price:Joi.number().required(),
  quantity:Joi.number().min(1).required()
}).min(1).required()