import React from "react"
import { Spinner } from "../Spinner"

type IButtonProps = {
    label: string | React.ReactNode
    variant: "outlined" | "contained" | "text"
    loading?: boolean
    onClick?: Function
} & React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Button component that renders a button with specified properties.
 * @param {IButtonProps} props - The props object containing label, variant, loading, onClick, and other button HTML attributes.
 * @returns {JSX.Element} - Button component JSX.
 */
export const Button: React.FC<IButtonProps> = (props) => {
    const {
        disabled = false,
        onClick,
        variant = "contained",
        loading = false,
        label,
        type = "button",
        className,
        ...others
    } = props
    return (
        <button
            type={type}
            {...others}
            onClick={onClick}
            disabled={disabled || loading}
            className={`border-primary-dark relative inline-block cursor-pointer rounded-[6px] border px-6 py-2 text-center align-middle text-sm font-medium outline-none transition-all duration-300 ease-in-out md:py-3 md:text-base
      ${buttonConfig[variant]} disabled:pointer-events-none ${loading ? "!bg-[#D8DDFF] !text-[#37449F]" : ""} ${className}`}
        >
            <span className="flex items-center justify-center gap-4 space-x-3">
                {label}

                {/* Display spinner if loading */}
                {loading && (
                    <>
                        <Spinner />
                    </>
                )}
            </span>
        </button>
    )
}

// Object containing styles for different button variants
const buttonConfig = {
    outlined:
        "bg-white text-black border border-primary hover:bg-primary-dark hover:text-primary disabled:border-gray-200 disabled:text-gray-500",
    text: "border-none bg-transparent text-primary-dark disabled:text-opacity-50",
    contained:
        "bg-primary text-black hover:text-primary hover:bg-white hover:shadow-md disabled:bg-opacity-20 disabled:text-opacity-50 disabled:border-none",
}
