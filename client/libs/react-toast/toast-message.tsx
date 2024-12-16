import { FaCircleCheck } from "react-icons/fa6"
import { FaInfoCircle, FaExclamationCircle } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

import { IMakeToastOptions } from "./toast"

interface ToastMessageProps extends IMakeToastOptions {
    onClose: () => void
}

export const ToastMessage = (props: ToastMessageProps) => {
    const { message, type } = props

    const getToastItems = () => {
        switch (type) {
            case "success":
                return {
                    icon: <FaCircleCheck className="text-xl text-[#0D9D31]" />,
                    style: { border: "1px solid #0D9D31 ", backgroundColor: "#CFF2D8" },
                    className: "border-[#0D9D31] bg-[#CFF2D8]",
                    value: "Success",
                }
            case "error":
                return {
                    icon: <MdCancel className="text-xl text-[#C71D32]" />,
                    style: { border: "1px solid #C71D32 ", backgroundColor: "#FCD3D8" },
                    className: "border-[#C71D32] bg-[#FCD3D8]",
                    value: "Error",
                }
            case "info":
                return {
                    icon: <FaInfoCircle style={{ color: "#0F27BD" }} className="text-xl" />,
                    style: { border: "1px solid #0F27BD ", backgroundColor: "#E7E9F8" },
                    className: "border-[#0F27BD] bg-[#E7E9F8]",
                    value: "Info",
                }
            case "warning":
                return {
                    icon: <FaExclamationCircle className="text-xl text-[#DFD407]" />,
                    style: { border: "1px solid #DFD407 ", backgroundColor: "#FCFBE6" },
                    className: "border-[#DFD407] bg-[#FCFBE6]",
                    value: "Warning",
                }
        }
    }

    return (
        <div
            style={{
                ...getToastItems().style,
                maxWidth: "400px",
            }}
            className={`animate__animated animate__fadeInRight flex h-[50px] w-full items-center gap-2 overflow-y-scroll rounded-md border px-5 py-6 text-[#272727] shadow-md ${
                getToastItems().className
            } `}
        >
            <div className="basis-[10%]">{getToastItems().icon}</div>

            <p className="basis-[90%] text-sm font-normal">
                {getToastItems().value}!. {message}
            </p>
        </div>
    )
}
