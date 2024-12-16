import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IUpdateProfileRequest } from "../profile.interface"
import { profileService } from "../profile.service"

export const useUpdateProfileApi: () => IApiHookBaseResponse<IUpdateProfileRequest> = () => {
    const updateProfileRequest = useApi<IBaseApiResponse, IUpdateProfileRequest>((data: IUpdateProfileRequest) => {
        return profileService.updateProfile(data)
    })

    const handleUpdateProfile = async (data: IUpdateProfileRequest) => {
        updateProfileRequest.reset()

        return (await updateProfileRequest.request(data)) as IBaseApiResponse
    }

    return {
        handler: handleUpdateProfile,
        data: updateProfileRequest.data,
        error: updateProfileRequest.error,
        loading: updateProfileRequest.loading,
    }
}
