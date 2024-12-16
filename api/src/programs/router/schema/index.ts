import type { ValidationSchema } from "@/core"
import * as Joi from "joi"

export const createProgramSchema: ValidationSchema = {
    inputSchema: Joi.object({
        name: Joi.string().trim().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().required().iso().min(Joi.ref("startDate")),
    }),
}

export const findProgramSchema: ValidationSchema = {
    querySchema: Joi.object({
        programId: Joi.string().trim().optional(),
    }),
}

export const updateProgramSchema: ValidationSchema = {
    inputSchema: Joi.object({
        name: Joi.string().trim().optional(),
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().optional().iso().min(Joi.ref("startDate")),
    }),

    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
    }),
}

export const createProgramUserSchema: ValidationSchema = {
    inputSchema: Joi.object({
        user: Joi.object({
            email: Joi.string().email().required().trim(),
            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().required(),
        }).optional(),
    }),

    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
    }),
}

export const resendProgramUserMailSchema: ValidationSchema = {
    inputSchema: Joi.object({
        email: Joi.string().trim().required(),
    }),

    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
    }),
}

export const assignAdminToProgramSchema: ValidationSchema = {
    inputSchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
        adminId: Joi.string().length(36).trim().required(),
    }),
}

export const addProgramProfileFrameSchema: ValidationSchema = {
    inputSchema: Joi.object({
        profileFrameHeight: Joi.number().required(),
        profileFrameWidth: Joi.number().required(),
    }),

    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
    }),
}

export const addProgramCertificateFrameSchema: ValidationSchema = {
    inputSchema: Joi.object({
        certificateFrameHeight: Joi.number().required(),
        certificateFrameWidth: Joi.number().required(),
    }),

    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
    }),
}

const baseNodeSchema = Joi.object({
    type: Joi.string().required(),
    x: Joi.number().required(),
    y: Joi.number().required(),
    gravity: Joi.string().required().valid("north_east", "north_west", "south_east", "south_west", "center"),
})

const imageNodeSchema = baseNodeSchema.keys({
    type: Joi.string().valid("image").required(),
    overlay: Joi.string().optional(),
    width: Joi.number().min(50).required(),
    height: Joi.number().min(50).required(),
    radius: Joi.number().required(),
    crop: Joi.string().required(),
})

const textNodeSchema = baseNodeSchema.keys({
    type: Joi.string().valid("text").required(),
    font_family: Joi.string().required(),
    font_size: Joi.number().required(),
    font_weight: Joi.string().required(),
    color: Joi.string().required(),
    placeholder: Joi.boolean().optional(),
    text: Joi.alternatives().conditional("placeholder", {
        is: false,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
    entity: Joi.alternatives().conditional("placeholder", {
        is: true,
        then: Joi.string().valid("program", "date", "user").required(),
        otherwise: Joi.optional(),
    }),
    entity_key: Joi.alternatives().conditional("placeholder", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
    }),
})

export const createProgramNodeSchema: ValidationSchema = {
    inputSchema: Joi.object({
        nodes: Joi.array().required().min(1).items(Joi.alternatives().try(imageNodeSchema, textNodeSchema)),
        category: Joi.valid("profile", "certificate"),
    }),

    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
    }),
}

export const getProgramNodesSchems: ValidationSchema = {
    querySchema: Joi.object({
        programId: Joi.string().length(36).trim().required(),
        category: Joi.valid("profile", "certificate"),
    }),
}
