export type INodeType = "image" | "text"

export const placeholderTextNodeEntity = ["program", "date", "user"] as const

export type IPlaceholderTextNodeEntity = (typeof placeholderTextNodeEntity)[number]

interface INode {
    x: number
    y: number
}

export interface IImageNode extends INode {
    type: "image"
    overlay: string
    width: number
    height: number
    gravity: string
    radius: number
    crop: string
}

export interface ITextNode extends INode {
    type: "text"
    text: string
    font_family: string
    font_size?: number
    font_weight?: string
    color?: string
    placeholder?: boolean
}

export interface IPlaceholderTextNode extends ITextNode {
    type: "text"
    entity?: IPlaceholderTextNodeEntity
    entity_key?: string
}

export type Node = IImageNode | ITextNode | IPlaceholderTextNode

export type NodePayload =
    | IImageNode
    | {
          overlay: {
              text: string
              font_family: string
              font_size?: number
              font_weight?: string
          }

          color?: string
          x: number
          y: number
      }
