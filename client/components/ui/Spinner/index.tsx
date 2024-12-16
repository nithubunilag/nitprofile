import React from "react"

export const Spinner = () => {
    return (
        <div>
            <div className="relative clear-both mx-auto my-0 h-[25px] w-[25px] rounded-full opacity-100 before:absolute before:left-0 before:h-full before:w-full before:scale-100 before:animate-[spinner-wave-before_0.6s_infinite_linear] before:rounded-full before:border  before:border-[#C3C3CB] before:opacity-100 before:content-[''] after:absolute after:left-0 after:h-full after:w-full after:scale-0 after:animate-[spinner-wave-after_0.6s_infinite_linear] after:rounded-full after:border after:border-[#C3C3CB] after:opacity-0 after:content-['']"></div>
        </div>
    )
}
