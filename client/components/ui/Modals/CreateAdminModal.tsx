import { Input } from "@/components/form"
import { makeToast } from "@/libs/react-toast"
import { useInviteAdminApi } from "@/services/auth/auth-hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { TfiClose } from "react-icons/tfi"
import { z } from "zod"
import { Button } from "../Button"
import { IBaseModalProps, ModalLayout } from "./ModalLayout"

const schema = z.object({
    email: z.string().email(),
})

type schemaType = z.infer<typeof schema>

export const CreateAdminModal = (props: IBaseModalProps) => {
    const { modalIsMounted, handleClose } = props

    const { handler, loading } = useInviteAdminApi()

    const form = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = form

    const onSubmit: SubmitHandler<schemaType> = async (data) => {
        const response = await handler(data)

        if (!response || !response.message) return

        form.reset()

        makeToast({
            id: "admin-success",
            message: response?.message ?? "Created Admin Successfully",
            type: "success",
        })

        handleClose && handleClose()
    }

    return (
        <ModalLayout isMounted={modalIsMounted} onClose={handleClose}>
            <div className="px-2 md:px-0">
                <div className="mb-4 flex items-center justify-between border-b-2 border-[#676767_0.5] pb-2 text-[#000000_0.5]">
                    <h2 className="text-lg font-semibold md:text-xl">Create new Admin</h2>

                    <TfiClose
                        className="cursor-pointer text-base transition-all duration-300 ease-in-out hover:rotate-180 md:text-xl"
                        onClick={() => handleClose && handleClose()}
                    />
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        required
                        name="email"
                        label="Email"
                        register={register}
                        placeholder="Email"
                        error={errors?.email ? errors.email.message : undefined}
                    />

                    <div className="flex items-end justify-end">
                        <Button label="Cancel" variant="text" onClick={() => handleClose && handleClose()} />
                        <Button label="Create" variant="contained" loading={loading} type="submit" />
                    </div>
                </form>
            </div>
        </ModalLayout>
    )
}
