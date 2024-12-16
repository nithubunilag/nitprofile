import React, { useState } from "react"

interface ILoaded {
    totalBytes: number
    loadedBytes: number
    percent: number
}

interface IStatus {
    success: boolean
    error: boolean
    abort: boolean
}

interface IUploadFileProps {
    file: File
}

const useFileUploader = () => {
    const [loaded, setLoaded] = useState<ILoaded>({
        totalBytes: 0,
        loadedBytes: 0,
        percent: 0,
    })

    const [status, setStatus] = useState<IStatus>({
        success: false,
        error: false,
        abort: false,
    })

    const uploadFile = ({ file }: IUploadFileProps) => {
        const formData = new FormData()
        formData.append("image", file)

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener("progress", progressHandler, false)

        xhr.addEventListener("load", successHandler, false)

        xhr.addEventListener("error", errorHandler, false)

        xhr.addEventListener("abort", abortHandler, false)

        xhr.open("POST", "fileuploadss.php")
        xhr.send(formData)
    }

    const progressHandler = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
        const percent = (e.loaded / e.total) * 100
        const totalBytes = e.total
        const loadedBytes = e.loaded

        setLoaded({
            totalBytes,
            loadedBytes,
            percent: Math.round(percent),
        })
    }

    const successHandler = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
        setStatus({
            error: false,
            abort: false,
            success: true,
        })
    }

    const errorHandler = () => {
        setStatus({
            error: true,
            abort: false,
            success: false,
        })
    }

    const abortHandler = () => {
        setStatus({
            error: false,
            abort: true,
            success: false,
        })
    }

    return {
        loaded,
        status,
        uploadFile,
    }
}

export const App = () => {
    const { loaded, status, uploadFile } = useFileUploader()

    console.log(loaded )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        console.log(file)
        if (file) {
            uploadFile({ file })
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <div>Progress: {loaded.percent}%</div>
            <div>
                Status: {status.success ? "Success" : status.error ? "Error" : status.abort ? "Aborted" : "Pending"}
            </div>
        </div>
    )
}
