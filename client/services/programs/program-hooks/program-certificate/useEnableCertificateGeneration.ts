import { useApi } from "@/hooks/useApi"
import { IProgram } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useEnableCertificateGenerationApi: () => IApiHookBaseResponse<string, IProgram> = () => {
    const enableCertificateGenerationRequest = useApi<IBaseApiResponse<IProgram>, string>((programId: string) => {
        return programService.enableCertificateGeneration(programId)
    })

    const handleEnableCertificateGeneration = async (programId: string) => {
        enableCertificateGenerationRequest.reset()

        return (await enableCertificateGenerationRequest.request(programId)) as IBaseApiResponse<IProgram>
    }

    return {
        handler: handleEnableCertificateGeneration,
        data: enableCertificateGenerationRequest.data,
        error: enableCertificateGenerationRequest.error,
        loading: enableCertificateGenerationRequest.loading,
    }
}
