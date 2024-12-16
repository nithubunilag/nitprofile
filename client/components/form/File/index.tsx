"use client"

import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import React, { InputHTMLAttributes } from "react"
import { IDropZoneHandlerProps, useFormDropzone } from "@/hooks/useDropZone"
import { CloudIcon } from "@/public/icons"

/**
 * Interface for the FileInput component props.
 * @interface IFileInput
 * @template T - Type for form field values
 */
type IFileInput<T extends FieldValues> = {
    /**
     * The name of the form field associated with the file input.
     * @type {Path<T>}
     */
    name: Path<T>
    /**
     * The label for the file input.
     * @type {string}
     */
    label: string
    /**
     * Optional error message to display for the file input.
     * @type {string | undefined}
     */
    error?: string
    /**
     * The registration function provided by react-hook-form for registering the file input.
     * @type {UseFormRegister<T>}
     */
    register: UseFormRegister<T>
    /**
     * Optional callback function to handle changes in the file input.
     * @type {(file: IDropZoneHandlerProps) => void | undefined}
     */
    handleChange?: (file: IDropZoneHandlerProps) => void
    /**
     * The value of the file input. Can be a File object or a string representing the file path.
     * @type {File | string | undefined}
     */
    fileValue?: File | string
} & InputHTMLAttributes<HTMLInputElement>

/**
 * FileInput component for handling file input and displaying file preview.
 * @param {IFileInput} props - Props for the FileInput component
 * @returns {JSX.Element} - FileInput component JSX
 */
export const FileInput = <T extends FieldValues>(props: IFileInput<T>) => {
    const { name, label, error, register, fileValue, ...others } = props
    // Register input field with React Hook Form
    const { ref: registerRef, ...rest } = register(name);

    // Use custom hook to handle file drop
    const { onDrop, readableStream } = useFormDropzone({
        handleChange: props.handleChange,
        initialValue: props.fileValue,
    });

    // Use react-dropzone hook for drag and drop functionality
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });
    
    return (
        <div className="atmua-input flex w-full flex-col">
            <span
                className={`mb-2 text-sm font-medium text-[#272727] md:mb-3 md:text-base ${
                    others.disabled ? "disabled" : ""
                }`}
            >
                {label}

                {/* Render asterisk for required fields */}
                {others.required ? <sup className={`text-sm leading-none text-[#EF233C] md:text-base`}>*</sup> : null}
            </span>

            {/* Render file input with drag and drop functionality */}
            {!readableStream && (
                <label
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
                    {...getRootProps()}
                >
                    <div className=" flex w-full items-center  justify-center rounded-[4px] border border-solid border-transparent bg-white py-3 duration-200 ease-in focus-within:border-primary">
                        <CloudIcon />

                        <p className="ml-3 text-sm font-normal text-[#939393] ">
                            {/* Display instructions based on drag state */}
                            <span
                                className={`${isDragActive ? "opacity-1" : "opacity-0"} transition-all duration-300 ease-in-out`}
                            >
                                Drop the files here
                            </span>

                            <span
                                className={`${!isDragActive ? "opacity-1" : "opacity-0"} transition-all duration-300 ease-in-out`}
                            >
                                Drag and drop files to attach or <span className="text-[#4F5DC1]">browse</span>
                            </span>
                        </p>
                    </div>

                    {/* Actual input field for file selection */}
                    <input
                        {...getInputProps()}
                        {...rest}
                        type="file"
                        id={name}
                        name={name}
                        accept="image/*"
                        className="h-0 w-0 "
                    />
                </label>
            )}

            {/* Render file preview if file is selected */}
            {readableStream && (
                <div className="my-5 flex h-full w-full items-center justify-center">
                    <Image width={200} height={200} src={readableStream} alt="Passport Photograph" />
                </div>
            )}

            {/* Render error message if present */}
            {error && <span className="mt-1 text-xs text-[#EF233C]">{error}</span>}
        </div>
    )
}
