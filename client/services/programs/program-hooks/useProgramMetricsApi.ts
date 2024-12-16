import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IProgramMetrics } from "../program.interface"
import { programService } from "../program.service"

export const useProgramMetricsApi: () => IApiHookBaseResponse<string, IProgramMetrics> = () => {
    const getProgramMetricsRequest = useApi<IBaseApiResponse<IProgramMetrics>, string>((programId: string) => {
        return programService.getProgramMetrics(programId)
    })

    const handleGetProgramMetrics = async (programId: string) => {
        getProgramMetricsRequest.reset()

        return (await getProgramMetricsRequest.request(programId)) as IBaseApiResponse<IProgramMetrics>
    }

    return {
        handler: handleGetProgramMetrics,
        data: getProgramMetricsRequest.data,
        error: getProgramMetricsRequest.error,
        loading: getProgramMetricsRequest.loading,
    }
}
