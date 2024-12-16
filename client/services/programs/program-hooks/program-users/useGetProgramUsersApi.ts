import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IProgramUser } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"

export const useGetProgramUsersApi: () => IApiHookBaseResponse<string, IProgramUser[]> = () => {
    const getProgramUsersRequest = useApi<IBaseApiResponse<IProgramUser[]>, string>((programId: string) => {
        return programService.getProgramRegisteredUsers(programId)
    })

    const handleGetProgramUsers = async (programId: string) => {
        getProgramUsersRequest.reset()

        return (await getProgramUsersRequest.request(programId)) as IBaseApiResponse<IProgramUser[]>
    }

    return {
        handler: handleGetProgramUsers,
        data: getProgramUsersRequest.data,
        error: getProgramUsersRequest.error,
        loading: getProgramUsersRequest.loading,
    }
}
