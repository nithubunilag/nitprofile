import { axiosInstance } from "@/libs/axios"
import { IBaseApiResponse } from "../types"
import { IUpdateProfilePictureResponse, IUpdateProfileRequest } from "./profile.interface"

class ProfileService {
    private profileUrl!: string

    constructor(baseURL: string) {
        this.profileUrl = `${baseURL}/profile`
    }

    public async updateProfilePicture(data: FormData) {
        return await axiosInstance.put<IBaseApiResponse<IUpdateProfilePictureResponse>>(
            `${this.profileUrl}/update-pfp`,
            data,
        )
    }

    public async updateProfile(data: IUpdateProfileRequest) {
        return await axiosInstance.put<IBaseApiResponse>(`${this.profileUrl}/update-profile`, data)
    }
}

export const profileService = new ProfileService(process.env.APP_API_URL ?? "http://localhost:4000/api/v1")
