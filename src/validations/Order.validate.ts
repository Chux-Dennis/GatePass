import Joi from "joi";

export const createOrderSchema = Joi.object({
  tickets: Joi.array()
    .items(
      Joi.object({
        ticketTypeId: Joi.string()
          .uuid({ version: "uuidv4" })
          .required()
          .messages({
            "string.empty": "ticketTypeId is required",
            "string.guid": "ticketTypeId must be a valid UUID",
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": "quantity must be a number",
            "number.min": "quantity must be at least 1",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "tickets must be an array",
      "array.min": "at least one ticket must be included",
      "any.required": "tickets field is required",
    }),
});
