import cloud from "cloudinary"

const cloudinary = cloud.v2

import { config as configObj } from "./config"
import type { NodePayload } from "@/programs/types"

cloudinary.config({
    cloud_name: configObj.cloudinary.cloudName,
    api_key: configObj.cloudinary.apiKey,
    api_secret: configObj.cloudinary.apiSecret,
})

interface ITransformImageProps {
    framePublicId: string
    width: number
    height: number
    nodes: NodePayload[]
}

export const generateCloudinaryTransformationImage = (props: ITransformImageProps) => {
    const { framePublicId, height, nodes, width } = props

    return cloudinary.url(framePublicId, {
        transformation: [
            {
                width,
                height,
                crop: "fill",
                gravity: "center",
            },
            
            ...nodes,
        ],
    })
}

export { cloudinary }
