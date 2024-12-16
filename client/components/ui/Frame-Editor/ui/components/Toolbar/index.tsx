import { ConditionalComponent } from "@/components/animation"
import { ICreateNodeOptions, getTextForPlaceholder } from "@frame-editor/logic"
import { useSceneContext } from "@frame-editor/ui/hooks"
import { IEvent } from "fabric/fabric-impl"
import { useEffect } from "react"
import { MdDelete } from "react-icons/md"
import { ImageControls } from "./ImageControls"
import { ToolbarButton } from "./ToolbarButton"

interface IToolbarProps {
    /**
     * Function to create a node on canvas.
     * @param {ICreateNodeOptions} options - Options for creating a node.
     */
    create_node(options: ICreateNodeOptions): void
}

/**
 * Toolbar component for managing canvas controls and creating nodes.
 * @param {IToolbarProps} props - Props for Toolbar component.
 * @returns {JSX.Element} Toolbar component.
 */
export const Toolbar = (props: IToolbarProps) => {
    const { create_node } = props

    const { state, dispatch } = useSceneContext()

    // Canvas and Selected items being destructured from the state gotten from the context
    const { canvas, selectedItem } = state.scene

    /**
     * Function to handle canvas object selection event.
     * @param {IEvent<MouseEvent>} e - Mouse event.
     */
    const on_canvas_object_selection = (e: IEvent<MouseEvent>) => {
        if (!canvas) return null

        const activeObj = canvas.getActiveObject()

        if (!activeObj) return

        const objectType = activeObj.get("type") as "circle" | "i-text"

        if (!objectType) return

        dispatch({
            type: "select_object",
            payload: {
                item: activeObj,
            },
        })

        const tot_types = ["i-text", "circle", "image", "text"]

        if (objectType && tot_types.indexOf(objectType) >= 0) {
            /* Disable scaling */
            activeObj.setControlsVisibility({
                mt: false, // middle top disable
                mb: false, // midle bottom
                ml: false, // middle left
                mr: false, // I think you get it
            })
        }
    }

    /**
     * List of base controls for creating nodes.
     * @constant {Array<{ name: string, handler: Function }>} baseControls
     */
    const baseControls = [
        {
            name: "User Image",
            handler: () => create_node({ nodeType: "image" }),
        },

        {
            name: "Text",
            handler: () => create_node({ nodeType: "text" }),
        },

        {
            name: `{{"USER_NAME"}}`,
            handler: () =>
                create_node({
                    nodeType: "placeholder",
                    entity: "user",
                    entityKey: "firstName",
                    placeholderText: getTextForPlaceholder({ entity: "user", entityKey: "firstName" }),
                }),
        },

        // {
        //     name: `{{"DATE"}}`,
        //     handler: () =>
        //         create_node({
        //             nodeType: "placeholder",
        //             entity: "date",
        //             placeholderText: getTextForPlaceholder({ entity: "date" }),
        //         }),
        // },
    ]

    useEffect(() => {
        if (!canvas) return

        canvas.on("selection:created", on_canvas_object_selection)

        canvas.on("selection:updated", on_canvas_object_selection)

        canvas.on("selection:cleared", () => {
            dispatch({
                type: "deselect_object",
            })
        })
    }, [canvas])

    const handleDelete = () => {
        if (!canvas || !selectedItem) return

        canvas.remove(selectedItem)

        canvas.renderAll()

        dispatch({
            type: "deselect_object",
        })
    }

    if (!canvas) return null

    return (
        <div>
            {selectedItem && selectedItem.type === "circle" && <ImageControls />}

            {selectedItem && (
                <button
                    onClick={handleDelete}
                    className=" rounded-full border bg-red-500 px-3 py-3 text-white transition-all duration-300 ease-in-out hover:border-red-500 hover:bg-white hover:text-red-500 "
                >
                    <MdDelete className="text-xl " />
                </button>
            )}

            {/* {selectedItem && selectedItem.type === "i-text" && <TextControls />} */}

            <ConditionalComponent isMounted={!selectedItem}>
                <div className="grid grid-cols-toolbar_buttons_grid gap-4">
                    {baseControls.map((control, index) => (
                        <ToolbarButton key={index} label={control.name} onClick={() => control.handler()} />
                    ))}
                </div>
            </ConditionalComponent>
        </div>
    )
}
