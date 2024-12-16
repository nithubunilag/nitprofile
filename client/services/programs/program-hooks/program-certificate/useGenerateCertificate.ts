import { useApi } from "@/hooks/useApi"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useGenerateCertificateApi: () => IApiHookBaseResponse<string, undefined> = () => {
    const getGenerateCertificateRequest = useApi<IBaseApiResponse, string>((programId: string) => {
        return programService.generateCertificate(programId)
    })

    const handleGenerateCertificate = async (programId: string) => {
        getGenerateCertificateRequest.reset()

        return (await getGenerateCertificateRequest.request(programId)) as IBaseApiResponse
    }

    return {
        handler: handleGenerateCertificate,
        data: getGenerateCertificateRequest.data,
        error: getGenerateCertificateRequest.error,
        loading: getGenerateCertificateRequest.loading,
    }
}
