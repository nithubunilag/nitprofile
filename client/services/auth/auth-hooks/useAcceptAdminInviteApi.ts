import { authService } from "../auth.service"
import { IAcceptAdminInvitationRequest, IUser } from "../auth.interface"
import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

interface IAcceptAdminInvitationPayload {
    payload: IAcceptAdminInvitationRequest
    token: string
}

export const useAcceptAdminInviteApi: () => IApiHookBaseResponse<IAcceptAdminInvitationPayload, IUser> = () => {
    const acceptAdminInviteRequest = useApi<IBaseApiResponse<IUser>, IAcceptAdminInvitationPayload>(
        (data: IAcceptAdminInvitationPayload) => {
            return authService.accept_admin_invitation(data.payload, data.token)
        },
    )

    const handleAcceptAdminInvite = async (data: IAcceptAdminInvitationPayload) => {
        acceptAdminInviteRequest.reset()

        return (await acceptAdminInviteRequest.request(data)) as IBaseApiResponse<IUser>
    }

    return {
        handler: handleAcceptAdminInvite,
        data: acceptAdminInviteRequest.data,
        error: acceptAdminInviteRequest.error,
        loading: acceptAdminInviteRequest.loading,
    }
}
