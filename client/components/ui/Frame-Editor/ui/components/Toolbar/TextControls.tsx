import { makeToast } from "@/libs/react-toast"
import { DEFAULT_TEXT_NODE_VALUES } from "@frame-editor/logic"
import { useSceneContext } from "@frame-editor/ui/hooks"
import { ChangeEvent, useState } from "react"

interface ITextProperties {
    fontFamily: string
    left: number
    top: number
    fontSize: number
    fontWeight: string | number
    fill: string
    opacity: number
    stroke: string
}

export const TextControls = () => {
    const { state } = useSceneContext()

    const { canvas, selectedItem } = state.scene

    const item = selectedItem as fabric.Text

    const [textProperties, setTextProperties] = useState<ITextProperties>({
        fontFamily: item.fontFamily ?? DEFAULT_TEXT_NODE_VALUES.font_family,
        left: item.left ?? DEFAULT_TEXT_NODE_VALUES.x,
        top: item.top ?? DEFAULT_TEXT_NODE_VALUES.y,
        fontSize: item.fontSize ?? DEFAULT_TEXT_NODE_VALUES.font_size,
        fontWeight: item.fontWeight ?? DEFAULT_TEXT_NODE_VALUES.font_weight,
        fill: item.fill?.toString() ?? DEFAULT_TEXT_NODE_VALUES.color,
        stroke: item.stroke?.toString() ?? DEFAULT_TEXT_NODE_VALUES.stroke,
        opacity: item.opacity ?? DEFAULT_TEXT_NODE_VALUES.opacity,
    })

    if (!canvas || !selectedItem) {
        return makeToast({
            id: "error_creating_canvas",
            message: "No Canvas or No Item Selected, Plase Contact Administrator",
            type: "error",
        })
    }

    const handleChange = (key: keyof fabric.Text, value: number | string) => {
        const activeObject = canvas.getActiveObject() as fabric.Text

        if (!activeObject) return

        activeObject.set(key, value)

        const newValues = { ...textProperties, [key]: value }

        setTextProperties(newValues)

        canvas.renderAll()
    }

    const options = [
        {
            name: "Font Family",
            value: textProperties.fontFamily,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("fontFamily", e.target.value),
            placeholder: "100",
        },
        {
            name: "Font Size",
            value: textProperties.fontSize,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("fontSize", parseInt(e.target.value)),
            placeholder: "10",
        },
        {
            name: "Font Weight",
            value: textProperties.fontWeight,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("fontWeight", e.target.value),
            placeholder: "100",
        },
        {
            name: "Left",
            value: textProperties.left,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("left", parseInt(e.target.value)),
            placeholder: "20",
        },
        {
            name: "Top",
            value: textProperties.top,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("top", parseInt(e.target.value)),
            placeholder: "20",
        },
        {
            name: "Opacity",
            value: textProperties.opacity,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("opacity", parseInt(e.target.value)),
            placeholder: 1,
        },
        {
            name: "Fill",
            value: textProperties.fill,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("fill", e.target.value),
            placeholder: "#aaa",
        },
        {
            name: "Stroke",
            value: textProperties.stroke,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("stroke", e.target.value),
            placeholder: "#000",
        },
    ]

    return (
        <div className="grid grid-cols-image_toolbar_buttons_grid gap-4 py-2">
            {options.map((option, index) => (
                <label key={index} htmlFor="Radius" className="flex w-full flex-col">
                    <span className="mb-1 text-sm font-medium  text-[#101010] disabled:text-[#B7B7B7]">
                        {option.name}
                    </span>

                    <div className="flex items-center gap-2 rounded-md border  border-[#676767] bg-white px-4 py-2 transition-all duration-300 ease-in-out focus-within:border-primary ">
                        <input
                            className={` w-full text-center text-sm  font-normal text-[#101010] outline-none placeholder:text-sm placeholder:text-[#676767]  `}
                            value={option.value}
                            onChange={option.handleChange}
                        />
                    </div>
                </label>
            ))}
        </div>
    )
}
