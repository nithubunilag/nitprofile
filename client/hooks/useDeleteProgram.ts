import { makeToast } from "@/libs/react-toast"
import { useDeleteProgramApi } from "@/services/programs/program-hooks"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"

export const useDeleteProgram = () => {
    const { handler, loading } = useDeleteProgramApi()

    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const dispatch = useAppDispatch()

    const { deleteSelectedProgram } = programSlice.actions

    const onSubmit = async () => {
        if (!selectedProgram) return

        await handler(selectedProgram.program.id)

        makeToast({
            id: "program-success",
            message: "Deleted Program Successfully",
            type: "success",
        })

        dispatch(deleteSelectedProgram())
    }

    return {
        onSubmit,
        loading,
    }
}
