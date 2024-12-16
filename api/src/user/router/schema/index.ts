import type { ValidationSchema } from "@/core"
import * as Joi from "joi"

export const updateprofileSchema: ValidationSchema = {
    inputSchema: Joi.object({
        firstName: Joi.string().trim().optional(),
        lastName: Joi.string().trim().optional(),
        otherName: Joi.string().trim().optional(),
        password: Joi.string().trim().optional(),
    }).required(),
}
