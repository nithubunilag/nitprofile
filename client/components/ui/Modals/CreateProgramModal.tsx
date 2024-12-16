import { Input } from "@/components/form"
import { useCreateProgram } from "@/hooks/useCreateProgram"
import { makeToast } from "@/libs/react-toast"
import { authSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { useEffect } from "react"
import { TfiClose } from "react-icons/tfi"
import { Button } from "../Button"
import { IBaseModalProps, ModalLayout } from "./ModalLayout"

export const CreateProgramModal = (props: IBaseModalProps) => {
    const { modalIsMounted, handleClose } = props

    const { closeModal, form, onSubmit, loading } = useCreateProgram(handleClose)

    const { allPrograms } = useAppSelector((state) => state.programSlice)

    const { data } = useAppSelector((state) => state.authSlice)

    const dispatch = useAppDispatch()

    const { logout } = authSlice.actions

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = form

    const handleLogout = () => {
        dispatch(logout())
    }

    useEffect(() => {
        if (!data || data.role === 'USER') return
        

        if (data?.role !== "SUPER ADMIN" && !allPrograms.length) {
            makeToast({
                id: "create-program-error",
                message: "You don't have the Permission to Create Program, Please Contact Super Admin.",
                type: "error",
                duration: 10000,
            })
        }
    }, [data, allPrograms])

    // If there is no program, don't allow the admin to close the portal until they have created a program

    return (
        <ModalLayout canClose={allPrograms.length ? true : false} isMounted={modalIsMounted} onClose={handleClose}>
            <div className="px-2 md:px-0">
                <div className="mb-4 flex items-center justify-between border-b-2 border-[#676767_0.5] pb-2 text-[#000000_0.5]">
                    <h2 className="text-lg font-semibold md:text-xl">Create new Program</h2>

                    <TfiClose
                        className="cursor-pointer text-base transition-all duration-300 ease-in-out hover:rotate-180 md:text-xl"
                        onClick={() => closeModal()}
                    />
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        required
                        name="name"
                        label="Name of Program"
                        register={register}
                        placeholder="Name of Program"
                        error={errors?.name ? errors.name.message : undefined}
                    />

                    <Input
                        required
                        name="startDate"
                        type="date"
                        label="Start Date"
                        register={register}
                        error={errors?.startDate ? errors.startDate.message : undefined}
                    />

                    <Input
                        required
                        name="endDate"
                        type="date"
                        label="End Date"
                        register={register}
                        error={errors?.endDate ? errors.endDate.message : undefined}
                    />

                    <div className="flex items-end justify-end gap-2">
                        {!data ||
                            (data?.role !== "SUPER ADMIN" && (
                                <Button label="Logout" onClick={handleLogout} variant="outlined" />
                            ))}

                        {data && data?.role === "SUPER ADMIN" && (
                            <Button label="Cancel" onClick={closeModal} variant="text" />
                        )}

                        <Button
                            label="Create"
                            variant="contained"
                            disabled={!data || data?.role !== "SUPER ADMIN"}
                            loading={loading}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </ModalLayout>
    )
}
