import { authService } from "../auth.service"
import { IVerifyAccountRequest } from "../auth.interface"
import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useVerifyAccountApi: () => IApiHookBaseResponse<IVerifyAccountRequest> = () => {
    const verifyAccountRequest = useApi<IBaseApiResponse, IVerifyAccountRequest>((data: IVerifyAccountRequest) => {
        return authService.verify_user_account(data)
    })

    const handleVerifyAccount = async (data: IVerifyAccountRequest) => {
        verifyAccountRequest.reset()

        return (await verifyAccountRequest.request(data)) as IBaseApiResponse
    }

    return {
        handler: handleVerifyAccount,
        data: verifyAccountRequest.data,
        error: verifyAccountRequest.error,
        loading: verifyAccountRequest.loading,
    }
}
