"use client"

import { Provider } from "react-redux"
import { Toaster } from "react-hot-toast"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/state_management"

/**
 * CustomProvider component that wraps the application with necessary providers and components.
 * Uses the Redux store, Redux Persist for state persistence, and react-hot-toast for toasts.
 *
 * @component
 * @param {React.PropsWithChildren} props - The properties passed to the component, including child components.
 * @returns {JSX.Element} JSX element representing the wrapped application with providers and components.
 */
export const CustomProvider = (props: React.PropsWithChildren) => {
    /**
     * Renders the CustomProvider component.
     *
     * @returns {JSX.Element} JSX element representing the wrapped application.
     */
    return (
        // Wrap the application with Redux Persist for state persistence and loading indicator.
        <PersistGate persistor={persistor} >
            {/* Provide the Redux store to the application. */}
            <Provider store={store}>
                {/* Display toasts using react-hot-toast. */}
                <Toaster />
                {/* Render child components passed to CustomProvider. */}
                {props.children}
            </Provider>
        </PersistGate>
    )
}
