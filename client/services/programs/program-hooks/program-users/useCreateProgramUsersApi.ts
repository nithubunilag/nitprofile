import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IProgramUser } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"

interface ICreateProgramUsersPayload {
    data: FormData
    programId: string
}

export const useCreateProgramUsersApi: () => IApiHookBaseResponse<ICreateProgramUsersPayload, IProgramUser[]> = () => {
    const createProgramUsersRequest = useApi<IBaseApiResponse<IProgramUser[]>, ICreateProgramUsersPayload>(
        (payload: ICreateProgramUsersPayload) => {
            return programService.registerBulkUsersForProgram(payload.programId, payload.data)
        },
    )

    const handleCreateBulkUsers = async (payload: ICreateProgramUsersPayload) => {
        createProgramUsersRequest.reset()

        return (await createProgramUsersRequest.request(payload)) as IBaseApiResponse<IProgramUser[]>
    }

    return {
        handler: handleCreateBulkUsers,
        data: createProgramUsersRequest.data,
        error: createProgramUsersRequest.error,
        loading: createProgramUsersRequest.loading,
    }
}
