import React, { InputHTMLAttributes, useMemo, useState } from "react"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import { FiEye, FiEyeOff } from "react-icons/fi"

type TInputProps<T extends FieldValues> = {
    name: Path<T>
    label: string
    error?: string
    prefixIcon?: React.ReactNode
    register: UseFormRegister<T>
} & InputHTMLAttributes<HTMLInputElement>

export const Input = <T extends FieldValues>(props: TInputProps<T>) => {
    const { name, label, error, prefixIcon, register, ...others } = props

    // State to manage password visibility
    const [secure, setSecure] = useState(true)

    // Memoized password icon component to toggle password visibility
    const passwordIcon = useMemo(() => {
        return (
            <div className="my-auto cursor-pointer pe-4" onClick={() => setSecure(!secure)}>
                {secure ? <FiEye /> : <FiEyeOff />}
            </div>
        )
    }, [secure, setSecure])

    return (
        <label htmlFor={name} className="flex w-full flex-col">
            <span
                aria-disabled={others.disabled}
                className={`mb-1 text-sm font-medium  text-[#101010] disabled:text-[#B7B7B7]`}
            >
                {label}

                {others.required ? <span className={`text-sm leading-none `}>*</span> : null}
            </span>

            <div
                className={`flex flex-row gap-x-2 overflow-hidden rounded-[4px] border border-[#676767_0.6] bg-transparent duration-200 ease-in focus-within:border-primary ${
                    error ? "!border-[#EF233C]" : ""
                }`}
            >
                <input
                    disabled={others.disabled}
                    id={name}
                    className={` text-[#101010]flex-1 w-full p-3 text-sm font-normal outline-none placeholder:text-sm placeholder:text-[#676767] disabled:cursor-not-allowed disabled:bg-[#F9F9F9] `}
                    {...register(name)}
                    {...others}
                    type={others.type === "password" ? (secure ? "password" : "text") : others.type}
                />

                {others.type === "password" && passwordIcon}

                {prefixIcon ? prefixIcon : null}
            </div>

            {error && <span className={` mt-1 text-xs text-[#EF233C]`}>{error}</span>}
        </label>
    )
}
