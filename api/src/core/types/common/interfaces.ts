import type { IncomingHttpHeaders } from "http"
import "express"
import type { Schema } from "joi"
import type { IHttpMethod } from "@/auth/helpers/permissions/types"
import type { auth_roles } from "@/auth/model"

interface IResourcePermissions {
    resourceName: string
    methods: IHttpMethod[]
}

export interface ControllerHandlerOptions {
    isPrivate: boolean
    isPrivateAndPublic?: boolean
    allowedRoles?: IAuthRoles[]
    grantedPermissions?: IResourcePermissions
}

export interface ITokenSignedPayload {
    id: string
    email: string
    role: IAuthRoles
}

// These are default Entity types that are prepopulated in the DB, if you add a new Entity Type, add it here also to avoid typographical errors
export type IAuthRoles = (typeof auth_roles)[number]

interface IParams {
    [key: string]: any
}

interface IQuery {
    [key: string]: any
}

interface IInput {
    [key: string]: any
}

export interface ContextTypes {
    params: IParams
    query: IQuery
    input: IInput
    user?: ITokenSignedPayload | undefined | null
    files: FileObjects
    headers: IncomingHttpHeaders
}

export interface RequestFileContents {
    name: string
    data: Buffer
    size: number
    encoding: string
    tempFilePath: string
    truncated: boolean
    mimetype: string
    md5: string
    mv(path: string, callback: (err: any) => void): void
    mv(path: string): Promise<void>
}
export interface FileObjects {
    [key: string]: RequestFileContents | RequestFileContents[]
}

type ExtractPayloadKeys<T> = {
    [K in keyof T]: K extends keyof ContextTypes ? K : never
}[keyof T]

type ExtractContextPayloadKeys<T> = Pick<T, ExtractPayloadKeys<T>>

export type Context<T> = T & ExtractContextPayloadKeys<T>

export interface ValidationSchema {
    inputSchema?: Schema
    paramsSchema?: Schema
    querySchema?: Schema
    fileSchema?: Schema
}
