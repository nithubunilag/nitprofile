import { authService } from "../auth.service"
import { IEmailOnlyRequest } from "../auth.interface"
import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useInviteAdminApi: () => IApiHookBaseResponse<IEmailOnlyRequest> = () => {
    const inviteAdminRequest = useApi<IBaseApiResponse, IEmailOnlyRequest>((data: IEmailOnlyRequest) => {
        return authService.invite_admin(data)
    })

    const handleInviteAdmin = async (data: IEmailOnlyRequest) => {
        inviteAdminRequest.reset()

        return (await inviteAdminRequest.request(data)) as IBaseApiResponse
    }

    return {
        handler: handleInviteAdmin,
        data: inviteAdminRequest.data,
        error: inviteAdminRequest.error,
        loading: inviteAdminRequest.loading,
    }
}
