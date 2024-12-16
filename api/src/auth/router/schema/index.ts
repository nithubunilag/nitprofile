import * as Joi from "joi"
import type { ValidationSchema } from "@/core"

export const signInSchema: ValidationSchema = {
    inputSchema: Joi.object({
        password: Joi.string().trim().required(),
        email: Joi.string().email().required().trim(),
    }),
}

export const verifyAccount: ValidationSchema = {
    inputSchema: Joi.object({
        password: Joi.string().trim().required(),
        token: Joi.string().length(64).required().trim(),
    }),
}

export const forgotPasswordSchema: ValidationSchema = {
    inputSchema: Joi.object({
        email: Joi.string().required().trim(),
    }),
}

export const resetPasswordSchema: ValidationSchema = {
    inputSchema: Joi.object({
        password: Joi.string().trim().required(),
        resetToken: Joi.string().required().trim(),
    }),
}

export const inviteAdminSchema: ValidationSchema = {
    inputSchema: Joi.object({
        email: Joi.string().email().required().trim(),
    }),
}

export const acceptInvitationSchema: ValidationSchema = {
    inputSchema: Joi.object({
        password: Joi.string().trim().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        otherName: Joi.string().trim().optional(),
    }),

    querySchema: Joi.object({
        token: Joi.string().trim().required(),
    }),
}
