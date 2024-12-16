import { IRole } from "@/state_management"
import { IoSettings } from "react-icons/io5"
import { GoHomeFill } from "react-icons/go"
import { IoPeople } from "react-icons/io5"
import { PiCertificateFill } from "react-icons/pi"
import { ImProfile } from "react-icons/im"
import { GrUserAdmin } from "react-icons/gr"

/**
 * Represents the data structure for sidebar data.
 * @typedef {Array<SidebarItem>} ISidebarData
 */
interface ISidebarData {
    name: string
    icon: React.ReactElement
    route: string
    activeRoutes: (string | undefined)[]
}

/**
 * Sidebar routes for the admin role.
 * @type {Array<SidebarItem>}
 */
const adminRoutes: ISidebarData[] = [
    {
        name: "Home",
        icon: <GoHomeFill className="" />,
        route: "/admin",
        activeRoutes: ["", undefined],
    },
    {
        name: "Users",
        icon: <IoPeople />,
        route: "/admin/users",
        activeRoutes: ["users"],
    },
    {
        name: "Profile",
        icon: <ImProfile />,
        route: "/admin/profile",
        activeRoutes: ["profile"],
    },
    {
        name: "Certificate",
        icon: <PiCertificateFill />,
        route: "/admin/certificate",
        activeRoutes: ["certificate"],
    },
    {
        name: "Settings",
        icon: <IoSettings />,
        route: "/admin/settings",
        activeRoutes: ["settings"],
    },
]

/**
 * Sidebar routes for the user role.
 * @type {Array<SidebarItem>}
 */
const userRoutes = [
    {
        name: "Home",
        icon: <GoHomeFill className="" />,
        route: "/student",
        activeRoutes: ["", undefined],
    },
    {
        name: "Profile",
        icon: <ImProfile />,
        route: "/student/profile",
        activeRoutes: ["profile"],
    },
    {
        name: "Certificate",
        icon: <PiCertificateFill />,
        route: "/student/certificate",
        activeRoutes: ["certificate"],
    },
    {
        name: "Settings",
        icon: <IoSettings />,
        route: "/student/settings",
        activeRoutes: ["settings"],
    },
]

/**
 * Retrieves sidebar data based on the user's role.
 * @param {IRole} role - The user's role.
 * @returns {ISidebarData[]} - An array of sidebar data based on the user's role.
 */
export const getSidebarData = (role: IRole | undefined): ISidebarData[] => {
    switch (role) {
        case "ADMIN":
            return adminRoutes

        case "SUPER ADMIN":
            return [
                ...adminRoutes,
                // {
                //     name: "Admins",
                //     icon: <GrUserAdmin />,
                //     route: "/admin/manage-admins",
                //     activeRoutes: ["manage-admins"],
                // },
            ]

        case "USER":
            return userRoutes

        default:
            return []
    }
}
