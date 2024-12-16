export type IUpdateProfileRequest = Partial<{
    lastName: string
    firstName: string
    otherName: string
    password: string
}>

export interface IUpdateProfilePictureResponse {
    publicId: string
    secureUrl: string
}
