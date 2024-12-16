import { makeToast } from "@/libs/react-toast"
import { useCreateProgramUsersApi } from "@/services/programs/program-hooks/program-users"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { useState } from "react"
import { IDropZoneHandlerProps } from "./useDropZone"

interface ICSVProperties {
    data: string[][]
    file: File | null
    deleted: boolean
}

export const useCreateBulkUsers = (handleClose?: Function) => {
    const { handler, loading } = useCreateProgramUsersApi()

    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const dispatch = useAppDispatch()

    const { addProgramUsers } = programSlice.actions

    const [csv, setCsv] = useState<ICSVProperties>({
        data: [],
        file: null,
        deleted: false,
    })

    const handleFileUpload = (uploadedContent: IDropZoneHandlerProps) => {
        if (uploadedContent.file) {
            const reader = new FileReader()
            reader.onload = (e) => handleFileRead(e, uploadedContent.file)
            reader.readAsText(uploadedContent.file)
        }
    }

    const handleFileRead = (event: ProgressEvent<FileReader>, file: File) => {
        const csvData = event.target && (event.target.result as string)

        if (csvData) {
            const rows = csvData.split("\n").map((row) => row.split(","))

            setCsv({ ...csv, data: rows, file: file, deleted: false })
        }
    }

    const deleteCSV = () => {
        setCsv({
            file: null,
            data: [],
            deleted: true,
        })
    }

    // Get Program User

    const onSubmit = async () => {
        if (!selectedProgram || !csv.file) return

        const formData = new FormData()

        formData.append("csv", csv.file)

        const response = await handler({
            data: formData,
            programId: selectedProgram?.program.id,
        })

        if (!response || !response.data) return

        dispatch(addProgramUsers(response.data))

        makeToast({
            id: "users-success",
            message: "Users Added to Program Successfully",
            type: "success",
        })

        setCsv({
            file: null,
            data: [],
            deleted: true,
        })

        handleClose && handleClose()
    }

    return {
        onSubmit,
        loading,
        handleFileUpload,
        deleteCSV,
        csvData: csv.data,
        csvDeleted: csv.deleted,
    }
}
