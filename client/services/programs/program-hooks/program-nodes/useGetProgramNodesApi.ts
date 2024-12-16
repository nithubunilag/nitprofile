import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IProgramNode } from "../../program.interface"
import { programService } from "../../program.service"

interface IGetProgramNodes {
    category: "profile" | "certificate"
    programId: string
}

export const useGetProgramNodesApi: () => IApiHookBaseResponse<IGetProgramNodes, IProgramNode[]> = () => {
    const getProgramNodesRequest = useApi<IBaseApiResponse<IProgramNode[]>, IGetProgramNodes>(
        (payload: IGetProgramNodes) => {
            return programService.getProgramNodes(payload.programId, payload.category)
        },
    )

    const handleGetProgramNodes = async (payload: IGetProgramNodes) => {
        getProgramNodesRequest.reset()

        return (await getProgramNodesRequest.request(payload)) as IBaseApiResponse<IProgramNode[]>
    }

    return {
        handler: handleGetProgramNodes,
        data: getProgramNodesRequest.data,
        error: getProgramNodesRequest.error,
        loading: getProgramNodesRequest.loading,
    }
}
