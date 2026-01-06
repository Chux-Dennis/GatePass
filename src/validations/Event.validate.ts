
import Joi from "joi";
import { EventAttributes } from "../types/Events.types";

export const newEventValidate = Joi.object<EventAttributes>({
  title: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required(),

  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required(),

  location: Joi.string()
    .trim()
    .min(3)
    .max(120)
    .required(),

  startDate: Joi.date()
    .min("now")
    .required()
    .messages({
      "date.min": "Start date must be today or in the future",
    }),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required()
    .messages({
      "date.greater": "End date must be after start date",
    }),
})
.options({ abortEarly: false }).min(1).required()
