"use client"
import { Button } from "@/components/ui/Button"
import { DropzoneModal } from "@/components/ui/Modals/DropzoneModal"
import { IDropZoneHandlerProps } from "@/hooks/useDropZone"
import { makeToast } from "@/libs/react-toast"
import { useUploadProgramCertificateFrame } from "@/services/programs/program-hooks/program-certificate/useUploadProgramCertificateFrame"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { getAsset } from "@/utils"
import Image from "next/image"
import { useRef, useState } from "react"

export interface IImageProperties {
    streamUrl: string
    fileObj: File | null
    deleted: boolean
}

export const CertificateEmptyState = () => {
    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const { handler, loading } = useUploadProgramCertificateFrame()

    const dispatch = useAppDispatch()

    const { addProgramCertificateFrame } = programSlice.actions

    const [uploadCertificateFrame, setUploadCertificateFrame] = useState(false)

    const [imageProperties, setImageproperties] = useState<IImageProperties>({
        streamUrl: "",
        fileObj: null,
        deleted: false,
    })

    const ref = useRef<HTMLImageElement>(null)

    const handleFileForm = (file: IDropZoneHandlerProps) => {
        setImageproperties({
            streamUrl: file.stream ?? "",
            fileObj: file.file ?? null,
            deleted: false,
        })
    }

    const onSubmit = async () => {
        if (!selectedProgram || !imageProperties.fileObj || !imageProperties.streamUrl) return

        const certificateFrameHeight = ref.current?.naturalHeight ?? 1000
        const certificateFrameWidth = ref.current?.naturalWidth ?? 1000

        const formData = new FormData()

        formData.append("frame", imageProperties.fileObj)
        formData.append("certificateFrameHeight", certificateFrameHeight.toString())
        formData.append("certificateFrameWidth", certificateFrameWidth.toString())

        const response = await handler({
            data: formData,
            programId: selectedProgram?.program.id,
        })

        if (!response || !response.data) return

        makeToast({
            id: "program-success",
            message: "Certificate Frame Uploaded Successfully",
            type: "success",
        })

        dispatch(
            addProgramCertificateFrame({
                programId: selectedProgram?.program.id,
                certificateFrameSecureUrl: response.data.certificateFrameSecureUrl!,
                certificateFramePublicId: response.data.certificateFramePublicId!,
                certificateFrameHeight: response.data.certificateFrameHeight!,
                certificateFrameWidth: response.data.certificateFrameWidth!,
            }),
        )

        setImageproperties({
            streamUrl: "",
            fileObj: null,
            deleted: false,
        })

        deleteFile()

        setUploadCertificateFrame(false)
    }

    const deleteFile = () => {
        setImageproperties({
            streamUrl: "",
            fileObj: null,
            deleted: true,
        })
    }

    return (
        <section className="flex h-full flex-col items-center justify-center">
            <DropzoneModal
                header={"Upload Certificate Frame"}
                modalIsMounted={uploadCertificateFrame}
                handleClose={() => setUploadCertificateFrame(false)}
                handleInputChange={handleFileForm}
                fileDeleted={imageProperties.deleted}
                accept={{
                    "image/*": [".jpeg", ".png"],
                }}
            >
                <div className="mx-auto mb-4 block max-h-[500px] w-full overflow-y-scroll border px-3">
                    <Image
                        ref={ref}
                        src={imageProperties.streamUrl}
                        alt="Uploaded Frame"
                        width={400}
                        height={400}
                        className="mx-auto"
                    />
                </div>

                <div className="items- flex justify-between">
                    <Button variant="outlined" label="Delete" disabled={loading} onClick={() => deleteFile()} />
                    <Button variant="contained" label="Submit" loading={loading} onClick={() => onSubmit()} />
                </div>
            </DropzoneModal>

            <Image src={getAsset("rocket.svg", "images")} alt="Rocket svg" width={280} height={280} />

            <p className="my-6 max-w-[32rem] text-center">
                There is no Certificate Frame for this Program. Click the button below to Upload a Certificate Frame for
                this program.
            </p>

            <Button
                label="Upload Certificate Frame"
                variant="contained"
                onClick={() => setUploadCertificateFrame(true)}
            />
        </section>
    )
}
