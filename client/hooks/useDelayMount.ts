"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook for delaying the mounting and unmounting of a component based on specified conditions.
 * Adds a bit of suspense without making your components go AWOL.
 *
 * @function
 * @name useDelayUnmount
 * @param {boolean} isMounted - Indicates whether the component is mounted or not.
 * @param {number} delayTime - The time in milliseconds to delay the unmounting of the component.
 * @returns {boolean} - Whether the component should be shown or not.
 */
export const useDelayUnmount = (isMounted: boolean, delayTime: number) => {
    // State to manage whether the component should be shown or not
    const [showItem, setShowItem] = useState(false)

    useEffect(() => {
        // Timeout identifier to manage delay
        let timeoutId: NodeJS.Timeout

        // Condition to show the item if it's mounted and not already shown
        if (isMounted && !showItem) {
            setShowItem(true)
        }

        // Condition to hide the item with a delay if it's not mounted and currently shown
        if (!isMounted && showItem) {
            // Delay the Unmounting
            timeoutId = setTimeout(() => setShowItem(false), delayTime)
        }

        // Cleanup function to clear the timeout on unmount or condition change
        return () => clearTimeout(timeoutId)
    }, [isMounted, delayTime, showItem])

    // Return whether the component should be shown or not
    return showItem
}
