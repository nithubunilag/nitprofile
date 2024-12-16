import { makeToast } from "@/libs/react-toast"
import { useSceneContext } from "@frame-editor/ui/hooks"
import { DEFAULT_IMAGE_NODE_VALUES } from "@frame-editor/logic"
import { ChangeEvent, useState } from "react"

export const TextControls = () => {
    const { state } = useSceneContext()

    const { canvas, selectedItem } = state.scene

    const item = selectedItem as fabric.Circle

    interface IImageProperties {
        fill: string
        left: number
        top: number
        scale: number
        radius: number
        strokeWidth: number
        stroke: string
        opacity: number
    }

    const [imageProperties, setImageProperties] = useState<IImageProperties>({
        fill: item.fill?.toString() ?? "#000",
        left: item.left ?? DEFAULT_IMAGE_NODE_VALUES.x,
        top: item.top ?? DEFAULT_IMAGE_NODE_VALUES.y,
        radius: item.radius ?? DEFAULT_IMAGE_NODE_VALUES.radius,
        strokeWidth: item.strokeWidth ?? 1,
        stroke: item.stroke?.toString() ?? "1",
        opacity: item.opacity ?? 1,
        scale: item.scaleX ?? 1,
    })

    if (!canvas || !selectedItem) {
        return makeToast({
            id: "error_creating_canvas",
            message: "No Canvas or No Item Selected, Plase Contact Administrator",
            type: "error",
        })
    }

    const handleChangeRadius = (value: number) => {
        if (!value) return

        const activeObject = canvas.getActiveObject() as fabric.Circle

        if (!activeObject) return

        activeObject.set("radius", value)

        activeObject.set("scaleX", 1)

        activeObject.set("scaleY", 1)

        const newValues = { ...imageProperties, radius: value, scale: 1 }

        setImageProperties(newValues)

        canvas.renderAll()
    }

    const handleChange = (key: keyof fabric.Object, value: number | string) => {
        const activeObject = canvas.getActiveObject()

        if (!activeObject) return

        activeObject.set(key, value)

        const newValues = { ...imageProperties, [key]: value }

        setImageProperties(newValues)

        canvas.renderAll()
    }

    const options = [
        {
            name: "Font Family",
            value: Math.round(imageProperties.radius * imageProperties.scale),
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChangeRadius(parseInt(e.target.value)),
            placeholder: "100",
        },
        {
            name: "Font Size",
            value: Math.round(imageProperties.radius * imageProperties.scale),
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChangeRadius(parseInt(e.target.value)),
            placeholder: "100",
        },
        {
            name: "Font Weight",
            value: Math.round(imageProperties.radius * imageProperties.scale),
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChangeRadius(parseInt(e.target.value)),
            placeholder: "100",
        },
        {
            name: "Left",
            value: imageProperties.left,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("left", parseInt(e.target.value)),
            placeholder: "20",
        },
        {
            name: "Top",
            value: imageProperties.top,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("top", parseInt(e.target.value)),
            placeholder: "20",
        },
        {
            name: "Opacity",
            value: imageProperties.opacity,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("opacity", parseInt(e.target.value)),
            placeholder: 1,
        },
        {
            name: "Fill",
            value: imageProperties.fill,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("fill", e.target.value),
            placeholder: "#aaa",
        },
        {
            name: "Stroke",
            value: imageProperties.stroke,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("stroke", e.target.value),
            placeholder: "#000",
        },
        {
            name: "Stroke Width",
            value: imageProperties.strokeWidth,
            handleChange: (e: ChangeEvent<HTMLInputElement>) => handleChange("left", parseInt(e.target.value)),
            placeholder: 1,
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
