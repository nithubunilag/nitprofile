import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IProgramNode } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"
import { Node } from "@/components/ui/Frame-Editor/logic"

interface ICreateProgramNodes {
    category: "profile" | "certificate"
    programId: string
    nodes: Node[]
}

export const useCreateProgramNodesApi: () => IApiHookBaseResponse<ICreateProgramNodes, IProgramNode[]> = () => {
    const createProgramNodesRequest = useApi<IBaseApiResponse<IProgramNode[]>, ICreateProgramNodes>(
        (payload: ICreateProgramNodes) => {
            return programService.createProgramNode(payload.programId, {
                category: payload.category,
                nodes: payload.nodes,
            })
        },
    )

    const handleCreateProgramNodes = async (payload: ICreateProgramNodes) => {
        createProgramNodesRequest.reset()

        return (await createProgramNodesRequest.request(payload)) as IBaseApiResponse<IProgramNode[]>
    }

    return {
        handler: handleCreateProgramNodes,
        data: createProgramNodesRequest.data,
        error: createProgramNodesRequest.error,
        loading: createProgramNodesRequest.loading,
    }
}
