import { IUser } from "../auth/auth.interface"

export interface IProgram {
    id: string
    name: string
    startDate: string
    endDate: string
    isCompleted: boolean
    profileFrameSecureUrl: string | null
    profileFramePublicId: string | null
    profileFrameHeight: string | null
    profileFrameWidth: string | null
    profileGenerationAvailable: boolean
    certificateFrameSecureUrl: string | null
    certificateFramePublicId: string | null
    certificateFrameHeight: string | null
    certificateFrameWidth: string | null
    certificateGenerationAvailable: boolean
}

export interface ICreateProgramPayload {
    name: string
    startDate: string
    endDate: string
}

export interface IUserProgram {
    id: string
    userId: string
    programId: string
    completedTraining: boolean
    profileImageUrl: string | null
    profileGenerationDate: Date | null
    certificateImageUrl: string | null
    certificateGenerationDate: Date | null
}

export interface IProgramUser extends IUser {
    user_programs: IUserProgram[]
}

export interface IRegisterSingleUserForProgram {
    user: {
        email: string
        firstName: string
        lastName: string
    }
}

export interface IAdminAssignedToProgram extends IUser {
    admins_assigned_programs: {
        id: string
        userId: string
        programId: string
    }[]
}

export interface IAssignAdminToProgramPayload {
    adminId: string
    payloadid: string
}

export interface IProgramNode {
    placeholder: boolean
    type: "image" | "text"
    x: number
    y: number
    width: number
    height: number
    gravity: string
    radius: number
    crop: string
    programId: string
    overlay: string | null
    text: string | null
    font_family: string | null
    font_size: string | null
    font_weight: string | null
    color: string | null
    entity: string | null
    entity_key: string | null
}

export interface IProgramMetrics {
    noOfProfilesGenerated: number
    noOfVerifiedUsers: number
    noOfCertificatesGenerated: number
}
