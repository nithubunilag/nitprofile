// @flow strict
"use client"
import React, { useEffect, useRef, useState } from "react"

interface IPopoverProps {
    children: React.ReactNode
    trigger?: "click" | "hover"
    content: string | React.ReactNode
    location?: "top" | "bottom"
    width?: number | "fit-content"
    onTrigger?: (show: boolean) => void
}

export const PopOver = ({
    children,
    content,
    trigger = "click",
    location = "top",
    width = "fit-content",
    onTrigger,
}: IPopoverProps) => {
    const [show, setShow] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const handleMouseOver = () => {
        if (trigger === "hover") {
            setShow(true)
        }
    }

    const handleMouseLeave = () => {
        if (trigger === "hover") {
            setShow(false)
        }
    }

    const handleClick = () => {
        if (trigger !== "click") return

        setShow(!show)

        if (onTrigger) {
            onTrigger(!show)
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setShow(false)

            if (onTrigger) {
                onTrigger(false)
            }
        }
    }

    useEffect(() => {
        if (show) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }

        if (onTrigger) {
            onTrigger(show)
        }
    }, [show])

    return (
        <div
            ref={wrapperRef}
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-fit w-fit justify-center"
        >
            <div className="cursor-pointer" onClick={handleClick}>
                {children}
            </div>

            <div
                style={{
                    width: show ? width : 0,
                }}
                className={`absolute ${
                    location === "top" ? "bottom-full" : "top-7"
                } right-0 z-50 transition-all duration-300 ease-in-out  ${
                    show ? " w-fit overflow-scroll opacity-100 " : "h-0 w-0 overflow-hidden opacity-0 "
                }`}
            >
                <div className="mb-[10px] rounded shadow-lg">{content}</div>
                {/* {typeof content === "string" ? (
                    <div className="mb-[10px] rounded shadow-md">{content}</div>
                ) : (
                    // Conditionally pass additional props to ReactNode content
                    React.cloneElement(content as React.ReactElement, {
                        show,
                        setShow,
                    })
                )} */}
                {/* <div className="rounded shadow-md mb-[10px]">{content}</div> */}
            </div>
        </div>
    )
}
