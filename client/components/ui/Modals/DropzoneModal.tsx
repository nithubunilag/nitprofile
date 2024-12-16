import { TfiClose } from "react-icons/tfi"
import { IBaseModalProps, ModalLayout } from "../Modals/ModalLayout"
import { IDropZoneHandlerProps, useFormDropzone } from "@/hooks/useDropZone"
import { DropzoneOptions, useDropzone } from "react-dropzone"
import { FaCloudUploadAlt } from "react-icons/fa"
import { useEffect } from "react"

interface IDropzoneModalProps extends IBaseModalProps {
    header: String
    handleInputChange?: (file: IDropZoneHandlerProps) => void
    fileDeleted?: boolean
    children?: React.ReactNode
}

type IDropzoneProps = IDropzoneModalProps & DropzoneOptions

export const DropzoneModal = (props: IDropzoneProps) => {
    const { modalIsMounted, handleClose, header, handleInputChange, fileDeleted, children, ...other } = props

    const { onDrop, fileUploaded, resetForm, deleteFile } = useFormDropzone({
        handleChange: handleInputChange,
    })

    const { getRootProps, isDragAccept, isDragReject, getInputProps } = useDropzone({
        ...other,
        onDrop,
    })

    const closeModal = () => {
        resetForm()

        if (handleClose) {
            handleClose()
        }
    }

    // I couldnt' find a way to handle delete so this is a patchy way...fix later
    useEffect(() => {
        fileDeleted && resetForm()
    }, [fileDeleted])

    return (
        <ModalLayout isMounted={modalIsMounted} onClose={handleClose}>
            <div className="px-2 md:px-0">
                <div className="mb-4 flex items-center justify-between border-b-2 border-[#676767_0.5] pb-2 text-[#000000_0.5]">
                    <h2 className="text-lg font-semibold md:text-xl">{header}</h2>

                    <TfiClose
                        className="cursor-pointer text-base transition-all duration-300 ease-in-out hover:rotate-180 md:text-xl"
                        onClick={() => closeModal()}
                    />
                </div>

                <div>
                    <div className={fileUploaded && children ? "block h-full overflow-y-scroll" : "hidden"}>
                        {children}
                    </div>

                    <div className={fileUploaded && !children ? "block" : "hidden"}>Hello</div>

                    <label
                        {...getRootProps()}
                        className={`${!fileUploaded ? "group flex" : "hidden"} h-[400px] cursor-pointer flex-col items-center justify-center rounded-md border border-[#676767]`}
                    >
                        <FaCloudUploadAlt className="mx-auto  mb-0 h-[80px] w-[80px] text-center text-[#676767] transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-[#3c3c3c]" />

                        <span className="flex flex-col gap-2 text-center text-sm text-[#676767]">
                            {isDragAccept && (
                                <span className="text-xs italic text-primary">This File would be Accepted</span>
                            )}

                            {isDragReject && (
                                <span className="text-xs italic text-[#EF233C]">This File would be rejected</span>
                            )}

                            {isDragAccept ? (
                                "Drop the files here"
                            ) : (
                                <p>
                                    Drag and drop files to attach or <span className="text-[#4F5DC1]">browse</span>
                                </p>
                            )}
                        </span>
                        <input {...getInputProps()} type="file" className="h-0 w-0 " />
                    </label>
                </div>
            </div>
        </ModalLayout>
    )
}
