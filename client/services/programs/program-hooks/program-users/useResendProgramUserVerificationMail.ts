import { useApi } from "@/hooks/useApi"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

interface IResendVerificationMailPayload {
    email: string
    programId: string
}

export const useResendProgramUserVerificationMailApi: () => IApiHookBaseResponse<IResendVerificationMailPayload> =
    () => {
        const resendVerificationMailRequest = useApi<IBaseApiResponse, IResendVerificationMailPayload>(
            (data: IResendVerificationMailPayload) => {
                return programService.resendProgramUserMail(data.programId, data.email)
            },
        )

        const handleResendProgramUserMail = async (data: IResendVerificationMailPayload) => {
            resendVerificationMailRequest.reset()

            return (await resendVerificationMailRequest.request(data)) as IBaseApiResponse
        }

        return {
            handler: handleResendProgramUserMail,
            data: resendVerificationMailRequest.data,
            error: resendVerificationMailRequest.error,
            loading: resendVerificationMailRequest.loading,
        }
    }
