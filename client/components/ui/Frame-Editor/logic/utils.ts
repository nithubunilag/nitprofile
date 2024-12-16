import { IProgramNode } from "@/services/programs/program.interface"
import { fabric } from "fabric"
import { IPlaceholderTextNodeEntity, Node } from "."

interface IOptions {
    objects: fabric.Object[]
    scaleFactor: number
}
interface IConvertNodeToObjectOptions {
    node: IProgramNode
    scaleFactor: number
}

interface ICalculateACoordsParams {
    tl_x: number
    tl_y: number
    width: number
    height: number
}

const convert_fabric_objects_to_nodes = (options: IOptions): Node[] => {
    const { objects, scaleFactor } = options

    const result: Node[] = []

    objects.forEach((item) => {
        if (item.type === "circle") {
            const computed_image_node = compute_image(item as fabric.Circle, scaleFactor)

            computed_image_node && result.push(computed_image_node)
        }

        if ((item.type = "i-text")) {
            const computed_text_node = compute_text(item as fabric.IText, scaleFactor)

            computed_text_node && result.push(computed_text_node)
        }
    })

    return result
}

const convert_node_to_fabric_object = (options: IConvertNodeToObjectOptions): fabric.Object | undefined => {
    const { scaleFactor, node } = options

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

        return new fabric.Circle({
            left: offset.x,
            top: offset.y,
            fill: "#aaa",
            opacity: 1,
            radius: dimensions.radius - 100,
            stroke: "#000",
            strokeWidth: 1,
            aCoords,
        })
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

        return textNode
    }
}

const compute_image = (fabricObj: fabric.Circle, scaleFactor: number) => {
    if (!fabricObj || !fabricObj.aCoords || !fabricObj.aCoords.tl || !fabricObj.aCoords.bl) return

    const scaledLeft = fabricObj.left! * scaleFactor

    const scaledTop = fabricObj.top! * scaleFactor

    // Get Offsets
    const offset = {
        x: Math.round(scaledLeft),
        y: Math.round(scaledTop),
    }

    // Get Updated Width and Height (Since it's a square, the width and height would be the same)
    const dimensions = {
        radius: Math.round(fabricObj.aCoords.bl.y * scaleFactor - fabricObj.aCoords.tl.y * scaleFactor),
    }

    // Compute Result and return
    const result = {
        type: "image" as "image",
        x: offset.x,
        y: offset.y,
        width: dimensions.radius,
        height: dimensions.radius,
        gravity: "north_west",
        radius: 1000,
        crop: "fit",
    }

    return result
}

const compute_text = (fabricObj: fabric.IText, scaleFactor: number) => {
    if (!fabricObj || !fabricObj.scaleX || !fabricObj.fontSize) return

    const scaledLeft = fabricObj.left! * scaleFactor

    const scaledTop = fabricObj.top! * scaleFactor

    // Get Offsets
    const offset = {
        x: Math.round(scaledLeft),
        y: Math.round(scaledTop),
    }

    const styles = {
        font_size: Math.round(fabricObj.fontSize * fabricObj.scaleX * scaleFactor),
        font_weight: (fabricObj.fontWeight as string) ?? "bold",
        font_family: (fabricObj.fontFamily as string) ?? "Helvetica",
    }

    const metadata = fabricObj.toObject()

    const result = {
        type: "text" as "text",
        x: offset.x,
        y: offset.y,
        gravity: "north_west",
        text: fabricObj.text ?? "My name is",
        font_family: styles.font_family,
        font_size: styles.font_size,
        font_weight: styles.font_weight,
        color: fabricObj.fill as string,
        placeholder: metadata?.placeholder ?? false,
        entity: metadata?.entity ?? undefined,
        entity_key: metadata?.entityKey ?? undefined,
    }

    if (!result.placeholder) {
        delete result.entity_key
        delete result.entity
        delete result.placeholder
    }

    return result
}

const calculateACoords = (params: ICalculateACoordsParams) => {
    const { height, tl_x, tl_y, width } = params

    const tr_x = tl_x + width
    const bl_y = tl_y + height

    return {
        tl: new fabric.Point(tl_x, tl_y),
        tr: new fabric.Point(tr_x, tl_y),
        bl: new fabric.Point(tl_x, bl_y),
        br: new fabric.Point(tr_x, bl_y),
    }
}

const getTextForPlaceholder = (item: IPlaceholderTextNodeEntity) => {
    switch (item.entity) {
        case "user":
            return "{{USER_FIRSTNAME}}"
        case "program":
            return "{{PROGRAM_NAME}}"
        case "date":
            return "DATE"
    }
}

const DEFAULT_CANVAS_VALUES = {
    width: 600,
    height: 300,
}

const DEFAULT_IMAGE_NODE_VALUES = {
    height: 100,
    width: 100,
    radius: 80,
    x: 50,
    y: 50,
    crop: "",
    gravity: "",
    overlay: "",
}

const DEFAULT_TEXT_NODE_VALUES = {
    type: "text",
    x: 50,
    y: 50,
    text: "Text",
    font_family: "Arial",
    font_size: 24,
    font_weight: "bold",
    color: "black",
}

export {
    DEFAULT_CANVAS_VALUES,
    DEFAULT_IMAGE_NODE_VALUES,
    DEFAULT_TEXT_NODE_VALUES,
    convert_fabric_objects_to_nodes,
    convert_node_to_fabric_object,
    getTextForPlaceholder,
}
