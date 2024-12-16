import { useApi } from "@/hooks/useApi"
import { IProgram } from "@/services/programs/program.interface"
import { programService } from "@/services/programs/program.service"
import { IApiHookBaseResponse, IBaseApiResponse } from "@/services/types"

interface IAddCertificateFramePayload {
    data: FormData
    programId: string
}

export const useUploadProgramCertificateFrame: () => IApiHookBaseResponse<IAddCertificateFramePayload, IProgram> = () => {
    const addCertificateFrameRequest = useApi<IBaseApiResponse<IProgram>, IAddCertificateFramePayload>(
        (payload: IAddCertificateFramePayload) => {
            return programService.uploadCertificateFrame(payload.programId, payload.data)
        },
    )

    const handleUploadCertificateFrame = async (payload: IAddCertificateFramePayload) => {
        addCertificateFrameRequest.reset()

        return (await addCertificateFrameRequest.request(payload)) as IBaseApiResponse<IProgram>
    }

    return {
        handler: handleUploadCertificateFrame,
        data: addCertificateFrameRequest.data,
        error: addCertificateFrameRequest.error,
        loading: addCertificateFrameRequest.loading,
    }
}
