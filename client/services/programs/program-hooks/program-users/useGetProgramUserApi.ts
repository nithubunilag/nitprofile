import { useApi } from "@/hooks/useApi"
import { IUserProgram } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

export const useGetProgramUserApi: () => IApiHookBaseResponse<undefined, IUserProgram[]> = () => {
    const getProgramUserRequest = useApi<IBaseApiResponse<IUserProgram[]>, string>(() => {
        return programService.getProgramRegisteredUser()
    })

    const handleGetProgramUser = async () => {
        getProgramUserRequest.reset()

        return (await getProgramUserRequest.request()) as IBaseApiResponse<IUserProgram[]>
    }

    return {
        handler: handleGetProgramUser,
        data: getProgramUserRequest.data,
        error: getProgramUserRequest.error,
        loading: getProgramUserRequest.loading,
    }
}
