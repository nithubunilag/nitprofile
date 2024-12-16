import type { ContextTypes, IAuthRoles, ITokenSignedPayload } from "@/core"

export interface ICreateUser {
    firstName: string
    otherName?: string
    lastName: string
    email: string
    password: string
    role: IAuthRoles
}

export interface FindNotificationsPayload extends ContextTypes {
    query: {
        notification_id: string
    }
}

export interface CreateNotificationEntityPayload extends ContextTypes {
    input: {
        name: string
        description?: string
    }
}


export interface DeleteNotificationEntityPayload extends ContextTypes {
    query: {
        entity_id: string
    }
}
