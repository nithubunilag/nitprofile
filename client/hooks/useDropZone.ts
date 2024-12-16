import { useCallback, useEffect, useState } from "react"

export interface IDropZoneHandlerProps {
    file: File
    stream?: string
}
interface IDropzoneOptions {
    handleChange?: (args: IDropZoneHandlerProps) => void
    initialValue?: File | string
}

export const convertFileToReadableStream = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = function () {
            const dataURL = reader.result as any
            const byteString = atob(dataURL?.split(",")[1])
            const arrayBuffer = new ArrayBuffer(byteString.length)
            const ia = new Uint8Array(arrayBuffer)
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i)
            }
            const imageBlob = new Blob([arrayBuffer], { type: "image/jpeg" })

            // Create an image URL
            const imageUrl = URL.createObjectURL(imageBlob)

            // Resolve the promise with the image URL
            resolve(imageUrl)
        }

        reader.onerror = function (error) {
            // Reject the promise in case of an error
            reject(error)
        }
    })
}

export const useFormDropzone = (options: IDropzoneOptions) => {
    const [readableStream, setReadableStream] = useState<string | null>(null)

    const [fileUploaded, setFileUploaded] = useState(false)

    const handleUploadFile = async (file: File) => {
        const stream = await handleConvertToStream(file)

        setFileUploaded(true)

        if (options.handleChange) {
            options.handleChange({
                file,
                stream,
            })
        }
    }

    const handleConvertToStream = async (file: File) => {
        const stream = await convertFileToReadableStream(file)

        setReadableStream(stream)

        return stream
    }

    useEffect(() => {
        if (options.initialValue && typeof options.initialValue !== "string") {
            handleConvertToStream(options.initialValue)
        }
        if (options.initialValue && typeof options.initialValue === "string") {
            setReadableStream(options.initialValue)
        }
    }, [options.initialValue])

    const onDrop = useCallback(
        async (acceptedFiles: Array<File>) => {
            const file = acceptedFiles[0]

            await handleUploadFile(file)
        },
        [options],
    )

    const resetForm = () => {
        setFileUploaded(false)
        setReadableStream("")
    }

    const deleteFile = () => {
        resetForm()
    }

    return {
        onDrop,
        readableStream,
        handleUploadFile,
        fileUploaded,
        resetForm,
        deleteFile
    }
}
