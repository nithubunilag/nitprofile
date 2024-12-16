import { useDelayUnmount } from "@/hooks/useDelayMount"
import React from "react"

interface IConditionalComponent {
    children: React.ReactNode
    isMounted: boolean
    delay?: number
}

export const ConditionalComponent = ({ children, isMounted, delay = 300 }: IConditionalComponent) => {
    // Custom hook for handling mounting and unmounting delay
    const showComponent = useDelayUnmount(isMounted, delay)

    // Styles for mounted and unmounted states
    const mountedStyle = { animation: "fade-in-animation 200ms ease-in" }

    const unmountedStyle: React.CSSProperties = {
        animation: "fade-out-animation 300ms ease-out",
        animationFillMode: "forwards",
    }

    return <>{showComponent && <div style={isMounted ? mountedStyle : unmountedStyle}>{children}</div>}</>
}
