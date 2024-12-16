import type { ContextTypes, RequestFileContents } from "@/core"

export interface UpdateProfilePicturePayload extends ContextTypes {
    files: {
        pfp: RequestFileContents
    }
}

export interface UpdateProfilePayload extends ContextTypes {
    input: {
        firstName?: string
        lastName?: string
        otherName?: string
        password?: string
    }
}
