import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateProgramApi } from "@/services/programs/program-hooks"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { makeToast } from "@/libs/react-toast"

const schema = z.object({
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
})

type schemaType = z.infer<typeof schema>

export const useCreateProgram = (handleClose?: Function) => {
    const { handler, loading } = useCreateProgramApi()

    const { allPrograms } = useAppSelector((state) => state.programSlice)

    const dispatch = useAppDispatch()

    const { addProgram, setSelectedProgram } = programSlice.actions

    const form = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const onSubmit: SubmitHandler<schemaType> = async (data) => {
        const response = await handler(data)

        if (!response || !response.data) return

        form.reset()

        makeToast({
            id: "program-success",
            message: "Created Program Successfully",
            type: "success",
        })

        dispatch(addProgram(response.data))

        dispatch(setSelectedProgram(response.data))

        handleClose && handleClose()
    }

    const closeModal = () => {
        if (allPrograms.length && handleClose) {
            handleClose()
        }
    }

    return {
        form,
        onSubmit,
        closeModal,
        loading,
    }
}
