import { useApi } from "@/hooks/useApi"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const usePreviewProfileCard: () => IApiHookBaseResponse<string, undefined> = () => {
    const getProfilePreviewRequest = useApi<IBaseApiResponse, string>((programId: string) => {
        return programService.previewProfile(programId)
    })

    const handleGetProgramMetrics = async (programId: string) => {
        getProfilePreviewRequest.reset()

        return (await getProfilePreviewRequest.request(programId)) as IBaseApiResponse
    }

    return {
        handler: handleGetProgramMetrics,
        data: getProfilePreviewRequest.data,
        error: getProfilePreviewRequest.error,
        loading: getProfilePreviewRequest.loading,
    }
}
