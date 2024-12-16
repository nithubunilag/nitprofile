import { authService } from "../auth.service"
import { IEmailOnlyRequest } from "../auth.interface"
import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useForgotPasswordApi: () => IApiHookBaseResponse<IEmailOnlyRequest> = () => {
    const forgotPasswordRequest = useApi<IBaseApiResponse, IEmailOnlyRequest>((data: IEmailOnlyRequest) => {
        return authService.forgot_password(data)
    })

    const handleForgotPassword = async (data: IEmailOnlyRequest) => {
        forgotPasswordRequest.reset()

        return (await forgotPasswordRequest.request(data)) as IBaseApiResponse
    }

    return {
        handler: handleForgotPassword,
        data: forgotPasswordRequest.data,
        error: forgotPasswordRequest.error,
        loading: forgotPasswordRequest.loading,
    }
}
