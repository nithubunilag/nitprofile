import { useApi } from "@/hooks/useApi"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const usePreviewCertificateCard: () => IApiHookBaseResponse<string, undefined> = () => {
    const getCertificatePreviewRequest = useApi<IBaseApiResponse, string>((programId: string) => {
        return programService.previewCertificate(programId)
    })

    const handleGetCertificatePreviewRequest = async (programId: string) => {
        getCertificatePreviewRequest.reset()

        return (await getCertificatePreviewRequest.request(programId)) as IBaseApiResponse
    }

    return {
        handler: handleGetCertificatePreviewRequest,
        data: getCertificatePreviewRequest.data,
        error: getCertificatePreviewRequest.error,
        loading: getCertificatePreviewRequest.loading,
    }
}
