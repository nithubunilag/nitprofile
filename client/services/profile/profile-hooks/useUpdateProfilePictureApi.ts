import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IUpdateProfilePictureResponse } from "../profile.interface"
import { profileService } from "../profile.service"

export const useUpdateProfilePictureApi: () => IApiHookBaseResponse<FormData, IUpdateProfilePictureResponse> = () => {
    const updateProfilePictureRequest = useApi<IBaseApiResponse<IUpdateProfilePictureResponse>, FormData>(
        (data: FormData) => {
            return profileService.updateProfilePicture(data)
        },
    )

    const handleUpdateProfilePicture = async (data: FormData) => {
        updateProfilePictureRequest.reset()

        return (await updateProfilePictureRequest.request(data)) as IBaseApiResponse<IUpdateProfilePictureResponse>
    }

    return {
        handler: handleUpdateProfilePicture,
        data: updateProfilePictureRequest.data,
        error: updateProfilePictureRequest.error,
        loading: updateProfilePictureRequest.loading,
    }
}
