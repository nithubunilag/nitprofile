import { IRole } from "@/state_management"

/**
 * Retrieves the allowed user roles based on the provided URL path.
 *
 * @function
 * @author Drex
 * @name getAllowedRoles
 * @param {string} urlPath - The URL path to extract information from.
 * @returns {IRole[]} - An array of allowed user roles for the given URL path.
 */
export const getAllowedRoles = (urlPath: string): IRole[] => {
    // Extract the current path from the URL
    const currentPath = urlPath.split("/")[1] as "admin" | "student"

    // Determine allowed roles based on the current path
    if (currentPath === "admin") {
        return ["ADMIN", "SUPER ADMIN"]
    }

    if (currentPath === "student") {
        return ["USER"]
    }

    // Return an empty array if the current path is not recognized
    return []
}
