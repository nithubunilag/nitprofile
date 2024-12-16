import { FrameEditor } from "./Scene"
import { createPortal } from "react-dom"
import { SceneProvider } from "./context"
import React from "react"

const FrameEditorWrapper = () => {
    /**
     * Utilized a context to oversee the state of the canvas.
     * This approach encapsulates all editor state within a single wrapper component, rather than across the entire application.
     * Opted against Redux in favor of a custom type system tailored for the application's needs.
     */
    return createPortal(
        <SceneProvider>
            <FrameEditor />
        </SceneProvider>,
        document.getElementById("canvas_portal") as HTMLElement,
    )
}

export const MemoizedFrameEditor = React.memo(FrameEditorWrapper)
