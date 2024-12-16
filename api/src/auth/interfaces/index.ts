import type { ContextTypes, IAuthRoles, ITokenSignedPayload } from "@/core"

export interface ICreateUser {
    firstName: string
    otherName?: string
    lastName: string
    email: string
    password: string
    role: IAuthRoles
    isVerified?:boolean
}

export interface SignInPayload extends ContextTypes {
    input: {
        email: string
        password: string
    }
}

export interface SignUpPayload extends ContextTypes {
    input: Omit<ICreateUser, "role"> & {
        token: string
    }
}

export interface SignOutPayload extends ContextTypes {
    user: ITokenSignedPayload
}

export interface ForgotPasswordPayload extends ContextTypes {
    input: {
        email: string
    }
}

export interface ResetPasswordPayload extends ContextTypes {
    input: {
        password: string
        resetToken: string
    }
}

export interface RefreshTokenPayload extends ContextTypes {}

export interface InviteAdminPayload extends ContextTypes {
    input: {
        email: string
    }
}

export interface AcceptAdminInvitationPayload extends ContextTypes {
    input: Omit<ICreateUser, "role" | "email">

    query: {
        token: string
    }
}

export interface VerifyAccountPayload extends ContextTypes {
    input: {
        token: string
        password: string
    }
}
