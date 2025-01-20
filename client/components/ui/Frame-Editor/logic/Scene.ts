import { IProgramNode } from "@/services/programs/program.interface"
import { fabric } from "fabric"
import { ICanvasOptions } from "fabric/fabric-impl"
import { ICreateNodeOptions, Node, PlaceholderKeys } from "./Interface"
import {
    calculateACoords,
    compute_image,
    compute_text,
    DEFAULT_CANVAS_VALUES,
    DEFAULT_IMAGE_NODE_VALUES,
    DEFAULT_TEXT_NODE_VALUES,
    getTextForPlaceholder,
} from "./utils"

type ICreateSceneOptions = {
    canvas_id: string
    options: ICanvasOptions
}

export class Scene {
    private canvas: fabric.Canvas | null = null

    private defaultCanvasSize = DEFAULT_CANVAS_VALUES

    constructor(private readonly sceneOptions: ICreateSceneOptions) {
        const { canvas_id, options } = this.sceneOptions

        this.canvas = new fabric.Canvas(canvas_id, options)

        this.canvas.on("object:moving", (e) => {
            var obj = e.target

            if (!obj || !obj.canvas || !obj.top || !obj.left) return

            const { height = this.defaultCanvasSize.height, width = this.defaultCanvasSize.width } = obj.canvas

            // if object is too big ignore
            if (obj.getScaledHeight() > height || obj.getScaledWidth() > width) {
                return
            }

            obj.setCoords()

            var boundingRect = obj.getBoundingRect()

            if (boundingRect.top < 0 || boundingRect.left < 0) {
                obj.top = Math.max(obj.top, obj.top - boundingRect.top)
                obj.left = Math.max(obj.left, obj.left - boundingRect.left)
            }

            if (boundingRect.top + boundingRect.height > height || boundingRect.left + boundingRect.width > width) {
                obj.top = Math.min(obj.top, height - boundingRect.height + obj.top - boundingRect.top)
                obj.left = Math.min(obj.left, width - boundingRect.width + obj.left - boundingRect.left)
            }
        })
    }
    get_canvas = () => {
        return this.canvas
    }

    create_node(options: ICreateNodeOptions) {
        if (!this.canvas) throw new Error("Canvas Does not Exist")

        if (options.nodeType === "image") {
            const imageNode = this.createImageObject()

            this.canvas.add(imageNode)

            return this.canvas.setActiveObject(imageNode)
        }

        if (options.nodeType === "text") {
            const textNode = this.createTextObject()

            this.canvas.add(textNode)

            return this.canvas.setActiveObject(textNode)
        }

        if (options.nodeType === "placeholder") {
            const textNode = this.createTextObject({
                ...options,
            })

            this.canvas.add(textNode)

            return this.canvas.setActiveObject(textNode)
        }

        throw new Error("Invalid node type")
    }

    convert_nodes_to_fabric_add_to_scene(node: IProgramNode, clientWidth: number) {
        if (!this.canvas) throw new Error("Canvas Does not Exist")

        const canvasWidth = this.canvas.getWidth()

        const scaleFactor = Math.round(clientWidth / canvasWidth)
                        console.log({ convertScaleFactor: scaleFactor, clientWidth, canvasWidth })


        if (node.type === "image") {
            if (node.overlay) {
                return new fabric.Image(node.overlay, {})
            }

            // Get Offsets
            const offset = {
                x: Math.round(node.x / scaleFactor),
                y: Math.round(node.y / scaleFactor),
            }

            const aCoords = calculateACoords({
                height: Math.round(node.width / scaleFactor),
                width: Math.round(node.width / scaleFactor),
                tl_x: offset.x,
                tl_y: offset.y,
            })

            const dimensions = {
                radius: Math.round(node.width / scaleFactor),
            }

            const fabricObj = new fabric.Circle({
                left: offset.x,
                top: offset.y,
                fill: "#aaa",
                opacity: 1,
                radius: dimensions.radius - 100,
                stroke: "#000",
                strokeWidth: 1,
                aCoords,
            })

            this.canvas.add(fabricObj)

            return fabricObj
        }

        if (node.type === "text") {
            const text = () => {
                if (node.placeholder) {
                    const t = {
                        entity: node.entity ?? "date",
                        entityKey: node.entity_key,
                    }
                    return getTextForPlaceholder(t as any)
                }

                return node.text!
            }

            // Get Offsets
            const offset = {
                x: Math.round(node.x / scaleFactor),
                y: Math.round(node.y / scaleFactor),
            }


            const styles = {
                font_size: Math.round(parseInt(node.font_size ?? "24") / scaleFactor),
                font_weight: (node.font_weight as string) ?? "bold",
                font_family: (node.font_family as string) ?? "Helvetica",
            }
            console.log({styles})

            const textNode = new fabric.IText(text(), {
                left: offset.x,
                top: offset.y,
                fontFamily: styles.font_family,
                fontSize: styles.font_size,
                fontWeight: styles.font_weight,
                fill: node.color ?? "#000",
                opacity: 1,
                editable: !node.placeholder,
            })

            if (node.placeholder) {
                textNode.toObject = () => {
                    return {
                        placeholder: true,
                        entity: node.entity,
                        entityKey: node?.entity_key ?? undefined,
                    }
                }
            }

            this.canvas.add(textNode)

            return textNode
        }
    }

    export_fabric_objects_to_nodes(objects: fabric.Object[], clientWidth: number): Node[] {
        if (!this.canvas) {
            console.log("Canvas Does not Exist")

            return []
        }

        const canvasWidth = this.canvas.getWidth()

        const scaleFactor = Math.round(clientWidth / canvasWidth)

        const result: Node[] = []

        objects.forEach((item) => {
            if (item.type === "circle") {
                const computed_image_node = compute_image(item as fabric.Circle, scaleFactor)

                computed_image_node && result.push(computed_image_node)
            }

            if ((item.type = "i-text")) {
                console.log({ exportScaleFactor: scaleFactor, clientWidth, canvasWidth })
                const computed_text_node = compute_text(item as fabric.IText, scaleFactor)

                computed_text_node && result.push(computed_text_node)
            }
        })

        return result
    }

    private createImageObject(): fabric.Circle {
        const createdFabricNode = new fabric.Circle({
            left: DEFAULT_IMAGE_NODE_VALUES.x,
            top: DEFAULT_IMAGE_NODE_VALUES.y,
            fill: "#aaa",
            radius: DEFAULT_IMAGE_NODE_VALUES.radius,
            opacity: 1,
            stroke: "#000",
            strokeWidth: 1,
        })

        return createdFabricNode
    }

    private createTextObject(placeholder?: PlaceholderKeys): fabric.Text {
        const isPlaceholder = placeholder && placeholder.entity

        const createdFabricNode = new fabric.IText(placeholder?.placeholderText ?? DEFAULT_TEXT_NODE_VALUES.text, {
            fontFamily: DEFAULT_TEXT_NODE_VALUES.font_family,
            left: DEFAULT_TEXT_NODE_VALUES.x,
            top: DEFAULT_TEXT_NODE_VALUES.y,
            fontSize: DEFAULT_TEXT_NODE_VALUES.font_size,
            fontWeight: DEFAULT_TEXT_NODE_VALUES.font_weight,
            fill: DEFAULT_TEXT_NODE_VALUES.color,
            opacity: DEFAULT_TEXT_NODE_VALUES.opacity,
            stroke: DEFAULT_TEXT_NODE_VALUES.stroke,
            editable: !isPlaceholder,
        })

        if (isPlaceholder) {
            createdFabricNode.toObject = () => {
                return {
                    placeholder: true,
                    entity: placeholder.entity,
                    entityKey: placeholder.entity !== "date" ? placeholder.entityKey : undefined,
                }
            }
        }

        return createdFabricNode
    }
}
