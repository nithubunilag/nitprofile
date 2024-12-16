import { useApi } from "@/hooks/useApi"
import { IProgram } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useEnableProfileCardGenerationApi: () => IApiHookBaseResponse<string, IProgram> = () => {
    const enableProfileGenerationRequest = useApi<IBaseApiResponse<IProgram>, string>((programId: string) => {
        return programService.enableProfileGeneration(programId)
    })

    const handleEnableProfileGeneration = async (programId: string) => {
        enableProfileGenerationRequest.reset()

        return (await enableProfileGenerationRequest.request(programId)) as IBaseApiResponse<IProgram>
    }

    return {
        handler: handleEnableProfileGeneration,
        data: enableProfileGenerationRequest.data,
        error: enableProfileGenerationRequest.error,
        loading: enableProfileGenerationRequest.loading,
    }
}
