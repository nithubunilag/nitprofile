"use client"
import { SidebarItems } from "./SidebarItem"
import { usePathname } from "next/navigation"
import { getSidebarData } from "./data"
import { appSlice, authSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { RiLogoutBoxRFill } from "react-icons/ri"
import { NitdaLogo } from "@/public/icons"
import { MdOutlineClose } from "react-icons/md"

export const Sidebar = () => {
    // Work on the keyboard accessibility

    // Determines whether the sidebar is opened or closed
    const { sidebarOpened } = useAppSelector((state) => state.appSlice)

    const { setSidebar } = appSlice.actions

    // Gets the current pathname using the usePathname hook
    const pathname = usePathname()

    const dispatch = useAppDispatch()

    const { logout } = authSlice.actions

    /**
     * Checks if the provided routes include the current path.
     * @param {string[]} routes - Array of route strings
     * @param {number} index - Index to extract the current path from the pathname
     * @returns {boolean} Whether the current path is included in the routes
     */
    const isItemActive = (routes: (string | undefined)[], index: number = 1) => {
        const currentPath = pathname.split("/")[index]
        return routes.includes(currentPath)
    }

    // Retrieves user data from the state
    const { data } = useAppSelector((state) => state.authSlice)

    // Retrieves sidebar data based on user role
    const sidebarData = getSidebarData(data?.role)

    const handleLogout = () => {
        // Let the logout function dispatch other acgtions redux
        dispatch(logout())
    }

    return (
        <aside
            className={`transition-width fixed left-0 top-0  flex h-full flex-shrink-0 flex-col duration-75 lg:flex ${
                sidebarOpened ? "w-screen md:w-[15rem]" : "w-0"
            }`}
            aria-label="Sidebar"
        >
            <div
                className={`relative flex h-full min-h-0  flex-1 flex-col  bg-white px-4 py-5 ${sidebarOpened ? "block" : "hidden"}`}
            >
                <div className="mb-12 flex items-center justify-between">
                    <NitdaLogo width={150} height={50} />
                    <MdOutlineClose
                        onClick={() => dispatch(setSidebar(false))}
                        className="text-3xl text-[#101010] md:hidden"
                    />
                </div>

                <div className="flex h-full flex-col justify-between gap-4 ">
                    <div className="flex flex-col gap-5">
                        {sidebarData.map((item, index) => (
                            <SidebarItems
                                key={item.name}
                                active={isItemActive(item.activeRoutes, 2)}
                                icon={item.icon}
                                name={item.name}
                                route={item.route}
                            />
                        ))}
                    </div>

                    <SidebarItems icon={<RiLogoutBoxRFill />} name="Logout" onClick={handleLogout} />
                </div>
            </div>
        </aside>
    )
}
