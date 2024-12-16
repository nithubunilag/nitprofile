import { useApi } from "@/hooks/useApi"
import { IProgram } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

interface IAddProfileFramePayload {
    data: FormData
    programId: string
}

export const useUploadProgramProfileFrame: () => IApiHookBaseResponse<IAddProfileFramePayload, IProgram> = () => {
    const addProfileFrameRequest = useApi<IBaseApiResponse<IProgram>, IAddProfileFramePayload>(
        (payload: IAddProfileFramePayload) => {
            return programService.uploadProfileFrame(payload.programId, payload.data)
        },
    )

    const handleUploadProfileFrame = async (payload: IAddProfileFramePayload) => {
        addProfileFrameRequest.reset()

        return (await addProfileFrameRequest.request(payload)) as IBaseApiResponse<IProgram>
    }

    return {
        handler: handleUploadProfileFrame,
        data: addProfileFrameRequest.data,
        error: addProfileFrameRequest.error,
        loading: addProfileFrameRequest.loading,
    }
}
