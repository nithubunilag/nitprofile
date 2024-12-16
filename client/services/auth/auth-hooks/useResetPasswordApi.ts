import { authService } from "../auth.service"
import { IResetPasswordRequest } from "../auth.interface"
import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useResetPasswordApi: () => IApiHookBaseResponse<IResetPasswordRequest> = () => {
    const resetPasswordRequest = useApi<IBaseApiResponse, IResetPasswordRequest>((data: IResetPasswordRequest) => {
        return authService.reset_password(data)
    })

    const handleResetPassword = async (data: IResetPasswordRequest) => {
        resetPasswordRequest.reset()

        return (await resetPasswordRequest.request(data)) as IBaseApiResponse
    }

    return {
        handler: handleResetPassword,
        data: resetPasswordRequest.data,
        error: resetPasswordRequest.error,
        loading: resetPasswordRequest.loading,
    }
}
