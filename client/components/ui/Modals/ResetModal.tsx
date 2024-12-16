import { IBaseModalProps, ModalLayout } from "./ModalLayout"

export const ResetPasswordModal = (props: IBaseModalProps) => {
    const { modalIsMounted, handleClose } = props

    return (
        <ModalLayout isMounted={modalIsMounted} onClose={handleClose} >
            <div className=" px-8 py-10">
                <h2 className="text-primary-dark text-center text-3xl font-bold">Password Reset Successful!</h2>

                <p className="mx-auto mb-5 text-center text-lg font-light text-[#4B4E61] md:w-[80%]">
                    Congratulations! Your password has been reset successfully
                </p>
            </div>
        </ModalLayout>
    )
}
