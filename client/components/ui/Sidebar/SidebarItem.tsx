import { useRouter } from "next/navigation"
import React from "react"

interface ISidebarItem {
    name: string
    icon: React.ReactElement
    route?: string
    onClick?: Function
    active?: boolean
}

/**
 * SidebarItems component to display individual sidebar items.
 * @param {ISidebarItem} props - Props for SidebarItems component.
 * @returns {JSX.Element} Sidebar item component JSX.
 */
export const SidebarItems = (props: ISidebarItem) => {
    const { active = false, icon, name } = props

    // Initializes useRouter hook to access Next.js router
    const router = useRouter()

    /**
     * Handles the click event for the sidebar item.
     */
    const handleClick = () => {
        // Executes onClick function if provided
        if (props.onClick) {
            props.onClick()
        }

        // Navigates to the route if provided
        if (props.route) {
            router.push(props.route)
        }
    }

    return (
        <div
            onClick={handleClick}
            className={`cursor-pointer rounded-lg px-6 py-[10px] transition-all duration-300 ease-in-out hover:bg-[#7fca63] ${active ? "bg-[#62CF3A]" : "bg-transparent"}`}
        >
            <div className="flex items-center gap-4">
                {/* Clones the icon element with modified className based on active state */}
                {React.cloneElement(icon, {
                    className: `w-[18px] h-[18px] ${active ? "text-[#101010]" : "text-[#676767]"}`,
                })}

                {/* Renders the name of the sidebar item */}
                <p
                    className={`text-sm font-medium transition-all duration-300 ease-in-out ${active ? "text-[#101010]" : "text-[#676767]"}`}
                >
                    {name}
                </p>
            </div>
        </div>
    )
}
