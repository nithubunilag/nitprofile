import { makeToast } from "@/libs/react-toast"
import { useCreateProgramNodesApi } from "@/services/programs/program-hooks/program-nodes"
import { useAppSelector } from "@/state_management"
import { ICreateNodeOptions, Scene } from "@frame-editor/logic"
import { fabric } from "fabric"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSnapshotDimensions } from "."
import { useSceneContext } from "./useSceneContext"

export const useSceneLogic = () => {
    const router = useRouter()

    const sceneRef = useRef<Scene | null>(null)

    const frameImageRef = useRef<HTMLImageElement>(null)

    const { dispatch, state } = useSceneContext()

    const [frameImageLoading, setFrameImageLoading] = useState(true)

    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const programFrame = useMemo(() => {
        const node_type = localStorage.getItem("node_type") as "profile" | "certificate"

        if (!selectedProgram || !node_type) {
            router.back()
        }

        if (node_type !== "certificate" && node_type !== "profile") {
            router.back()
        }

        const frame = () => {
            switch (node_type) {
                case "profile":
                    return selectedProgram?.program.profileFrameSecureUrl ?? ""
                case "certificate":
                    return selectedProgram?.program.certificateFrameSecureUrl ?? ""
            }
        }

        return {
            frame: frame(),
            nodes: selectedProgram?.programNodes ?? [],
            node_type: node_type ?? "profile",
        }
    }, [selectedProgram])

    const getClientWidth = (node_type: "profile" | "certificate") => {
        switch (node_type) {
            case "profile":
                return selectedProgram?.program.profileFrameWidth ?? ""
            case "certificate":
                return selectedProgram?.program.certificateFrameWidth ?? ""
            default:
                return frameImageRef?.current?.naturalWidth.toString()
        }
    }

    const initializeScene = useCallback(() => {
        const scene = new Scene({
            canvas_id: "frame_editor",
            options: {
                selection: false,
                renderOnAddRemove: false, // Render canvas when objects are added or removed
            },
        })

        const canvas = scene.get_canvas()

        if (!canvas) {
            return makeToast({
                id: "error_creating_canvas",
                message: "Error Creating Canvas, Please Contact Administrator",
                type: "error",
            })
        }

        dispatch({
            type: "initialize_canvas",
            payload: {
                canvas,
            },
        })

        sceneRef.current = scene
    }, [])

    const initializeObjects = useCallback(() => {
        const nodes = programFrame.nodes

        if (!selectedProgram) return

        const node_type = localStorage.getItem("node_type") as "profile" | "certificate"

        const clientWidth = parseInt(getClientWidth(node_type) ?? "0")

        for (let node of nodes) {
            sceneRef.current?.convert_nodes_to_fabric_add_to_scene(node, clientWidth)
        }

        state.scene.canvas?.renderAll()
    }, [programFrame.nodes, selectedProgram, state.scene.canvas])

    // const newcanvas = new fabric.Canvas("frame_editor", {
    //     selection: false,
    //     renderOnAddRemove: false,
    // })

    // useEffect(() => {
    //     console.log(newcanvas, "canvas changed")
    // }, [newcanvas])

    useEffect(() => {
        const newcanvas = new fabric.Canvas("frame_editor", {
            selection: false,
            renderOnAddRemove: false,
        })
        console.log(newcanvas, "canvas changed", newcanvas.getWidth(), 'canvas width')
    }, [])

    const rescaleCanvas = (containerWidth: number, containerHeight: number) => {
        // Check if the image reference or canvas is not available
        if (!frameImageRef.current || !state.scene.canvas) return

        // Get the current width of the canvas
        const canvasWidth = state.scene.canvas.getWidth()

        // Calculate the scaling factor based on the container's width and the canvas width
        const scaleFactor = containerWidth / canvasWidth

        // Get all rendered objects on the canvas
        const renderedObjects = state.scene.canvas.getObjects()

        // Iterate over each object on the canvas
        renderedObjects.forEach((obj: fabric.Object) => {
            // Check if the object has necessary properties for scaling and positioning
            if (!obj.scaleX || !obj.scaleY || !obj.top || !obj.left) return

            // Store the original left and top positions of the object
            const originalLeft = obj.left
            const originalTop = obj.top

            // Scale the object's dimensions
            obj.scaleX *= scaleFactor
            obj.scaleY *= scaleFactor

            // Update the left and top positions of the object after scaling
            obj.left = originalLeft * scaleFactor
            obj.top = originalTop * scaleFactor

            // Update the coordinates of the object for proper rendering
            obj.setCoords()
        })

        // Update the canvas dimensions to match the container's dimensions
        state.scene.canvas.setWidth(containerWidth)
        state.scene.canvas.setHeight(containerHeight)

        // Render all objects on the canvas
        state.scene.canvas.renderAll()
    }

    const handleCreateNode = (options: ICreateNodeOptions): void => {
        sceneRef.current?.create_node(options)
    }

    useEffect(() => {
        if (sceneRef.current) return

        initializeScene()

        initializeObjects()
    })

    const snapshot = useSnapshotDimensions(frameImageRef)

    useEffect(() => {
        const handleResize = (): void => {
            // Check if the image reference is not available
            if (!frameImageRef.current) return

            // Get the width and height of the container
            const containerWidth = frameImageRef.current.offsetWidth
            const containerHeight = frameImageRef.current.offsetHeight

            // Rescale the canvas to fit the container
            rescaleCanvas(containerWidth, containerHeight)
        }

        // Add resize event listener when the component mounts
        window.addEventListener("resize", handleResize)

        // Call handleResize function immediately to ensure proper canvas sizing
        handleResize()

        // Remove resize event listener when the component unmounts
        return () => window.removeEventListener("resize", handleResize)
    }, [frameImageRef.current, snapshot]) // Dependency array includes imageRef.current to trigger useEffect when it changes

    const onImageLoad = () => {
        setFrameImageLoading(false)
    }

    const { handler, loading: saving } = useCreateProgramNodesApi()

    const saveCustomization = async () => {
        if (!selectedProgram) return

        const objects = state.scene.canvas?.getObjects()

        if (!objects || !state.scene.canvas || !frameImageRef.current) return

        const node_type = localStorage.getItem("node_type") as "profile" | "certificate"

        const clientWidth = parseInt(getClientWidth(node_type) ?? "0")

        const nodes = sceneRef.current?.export_fabric_objects_to_nodes(objects, clientWidth)

        console.log({ nodes })
        const response = await handler({
            category: node_type,
            nodes: nodes,
            programId: selectedProgram.program.id,
        })

        if (!response) return

        state.scene.canvas.clear()

        router.back()

        localStorage.removeItem("node_type")
    }

    return {
        handleCreateNode,
        saveCustomization,
        canvas: state.scene.canvas,
        frameImageRef,
        programFrame,
        onImageLoad,
        frameImageLoading,
        saving,
    }
}
