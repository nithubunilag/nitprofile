import { useApi } from "@/hooks/useApi"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"
import { IProgramUser, IRegisterSingleUserForProgram } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"

interface ICreateProgramUserPaylaod {
    programid: string
    data: IRegisterSingleUserForProgram
}

export const useCreateProgramUserApi: () => IApiHookBaseResponse<ICreateProgramUserPaylaod, IProgramUser> = () => {
    const createProgramUserRequest = useApi<IBaseApiResponse<IProgramUser>, ICreateProgramUserPaylaod>(
        (payload: ICreateProgramUserPaylaod) => {
            return programService.registerSingleUserForProgram(payload.programid, payload.data)
        },
    )

    const handleCreateProgramUser = async (payload: ICreateProgramUserPaylaod) => {
        createProgramUserRequest.reset()

        return (await createProgramUserRequest.request(payload)) as IBaseApiResponse<IProgramUser>
    }

    return {
        handler: handleCreateProgramUser,
        data: createProgramUserRequest.data,
        error: createProgramUserRequest.error,
        loading: createProgramUserRequest.loading,
    }
}
