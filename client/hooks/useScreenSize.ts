import { appSlice, useAppDispatch } from "@/state_management"
import { useEffect, useState } from "react"

export const useScreenSize = () => {
    const [screenWidth, setScreenWidth] = useState<number | null>(null)
    const { setSidebar } = appSlice.actions
    const dispatch = useAppDispatch()

    // Function to handle resizing
    const handleResize = () => {
        setScreenWidth(window.innerWidth)
    }

    useEffect(() => {
        // Setting initial screen width
        handleResize()

        // Adding event listener for resize
        window.addEventListener("resize", handleResize)

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    // Effect to toggle sidebar based on screen width
    useEffect(() => {
        if (screenWidth !== null) {
            dispatch(setSidebar(screenWidth <= 768 ? false : true))
        }
    }, [screenWidth, dispatch, setSidebar])

    // Returning null because it seems you don't need to return any component
    return null
}
