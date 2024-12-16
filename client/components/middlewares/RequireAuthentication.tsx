"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageLoader } from "@/components/ui/Loaders"
import { IRole, appSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { ConditionalComponent } from "../animation"

interface RequireAuthProps {
    children: React.ReactNode
    require?: "auth" | "no-auth"
    allowedRoles?: IRole[]
    loading?: boolean
}

interface IValidatorHandler {
    routeName?: string
}

/**
 * React component that conditionally renders its children based on authentication and authorization status.
 * Provides a sleek loading animation for a touch of suspense while validating routes.
 *
 * @component
 * @author Drex
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - The React node(s) to be rendered conditionally.
 * @param {"auth" | "no-auth"} [props.require="auth"] - Specifies whether authentication is required or not.
 *   - "auth" (default) - Requires authentication; redirects to "/auth" if not authenticated or authorized.
 *   - "no-auth" - Requires no authentication; redirects to "/student" or "/admin" based on user role if authenticated.
 * @returns {ReactElement} - The rendered React element.
 */
export const RequireAuthentication: React.FC<RequireAuthProps> = ({
    children,
    require = "auth",
    allowedRoles = [],
    loading = false,
}) => {
    // Next.js router instance for navigation
    const router = useRouter()

    // Redux store dispatch function
    const dispatch = useAppDispatch()

    // Selectors for authentication and appSlice state
    const { routeValidated } = useAppSelector((state) => state.appSlice)
    const { isAuthenticated, data } = useAppSelector((state) => state.authSlice)

    // Action creator from appSlice to set route validation status
    const { setRouteValidation } = appSlice.actions

    // State to manage loading status
    const [loadingState, setLoadingState] = useState(routeValidated ? false : true)

    /**
     * Handler function for route validation.
     *
     * @function
     * @name validatorHandler
     * @param {string} route - The route to navigate to.
     * @returns {void}
     */
    const validatorHandler = (options: IValidatorHandler) => {
        const { routeName } = options

        if (routeName) router.push(routeName)

        // Set loading to false after navigation
        setLoadingState(false)

        // Dispatch action to set route validation to true
        dispatch(setRouteValidation(true))

        // Reset route validation after a timeout
        setTimeout(() => {
            dispatch(setRouteValidation(false))
        }, 5000)
    }

    useEffect(() => {
        // Check if a validation was just previously done
        if (routeValidated) {
            return setLoadingState(false)
        }

        // Set loading to true for suspenseful animation
        setLoadingState(true)

        if (require === "auth") {
            if (!isAuthenticated || !data) {
                // If not authenticated, perform route validation to "/auth"
                return validatorHandler({
                    routeName: "/auth",
                })
            }

            if (isAuthenticated && data) {
                // Redirect to the previous route if user roles are not allowed
                if (allowedRoles.length > 0 && (!data || !allowedRoles.includes(data.role))) {
                    return validatorHandler({
                        routeName: "/auth",
                    })
                }

                // If authenticated, set loading to false
                return setLoadingState(false)
            }
        }

        if (require === "no-auth") {
            if (isAuthenticated && data) {
                // If authenticated, perform route validation based on user role
                return validatorHandler({
                    routeName: data.role === "USER" ? "/student" : "/admin",
                })
            } else {
                // If not authenticated, set loading to false
                return setLoadingState(false)
            }
        }
    }, [isAuthenticated, data, require])

    return (
        <>
            {/* Render a page loader while waiting for authentication and authorization checks */}
            <ConditionalComponent isMounted={loading || loadingState}>
                <PageLoader />
            </ConditionalComponent>

            {/* Render the children if no redirection is needed */}
            <ConditionalComponent isMounted={!loading && !loadingState}>{children}</ConditionalComponent>
        </>
    )
}
