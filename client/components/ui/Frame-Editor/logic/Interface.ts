import { IProgramNode } from "@/services/programs/program.interface"

type IPlaceholderTextNodeEntity =
    | {
          entity: "user"
          entityKey: string
      }
    | {
          entity: "program"
          entityKey: string
      }
    | {
          entity: "date"
      }

interface INode {
    x: number
    y: number
}

interface IImageNode extends INode {
    type: "image"
    overlay?: string
    width: number
    height: number
    gravity: string
    radius: number
    crop: string
}

interface INonPlaceholderTextNode extends INode {
    type: "text"
    text: string
    gravity: string
    font_family: string
    font_size?: number
    font_weight?: string
    color?: string
    placeholder?: false
}

interface IPlaceholderTextNode extends INode {
    type: "text"
    text: string
    font_family: string
    font_size?: number
    font_weight?: string
    color?: string
    placeholder?: true
    entity: IPlaceholderTextNodeEntity
    entity_key?: string
}

type ITextNode = INonPlaceholderTextNode | IPlaceholderTextNode

type Node = IImageNode | ITextNode

type PlaceholderKeys = IPlaceholderTextNodeEntity & {
    placeholderText: string
}

type ICreatePlaceHolderNode = PlaceholderKeys & {
    nodeType: "placeholder"
}

type ICreateNodeOptions =
    | {
          nodeType: "image" | "text"
      }
    | ICreatePlaceHolderNode

interface INodeFactory<T = undefined> {
    fabricNode: T
}

interface IConvertNodeToObjectOptions {
    node: IProgramNode
    scaleFactor: number
}

export type {
    IConvertNodeToObjectOptions,
    ICreateNodeOptions,
    IImageNode,
    INodeFactory,
    IPlaceholderTextNodeEntity,
    ITextNode,
    Node,
    PlaceholderKeys,
}
