import Joi from "joi"
import { type ValidationSchema } from "@/core"

export const notificationQuerySchema: ValidationSchema = {
  querySchema: Joi.object({
    notification_id: Joi.string().optional(),
  }),
}

export const createNotificationEntitySchema: ValidationSchema = {
  inputSchema: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
}


export const notificationEntityQuerySchema: ValidationSchema = {
  querySchema: Joi.object({
    entity_id: Joi.string().optional(),
  }),
}