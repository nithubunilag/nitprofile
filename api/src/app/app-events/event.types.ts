import { type ExtractParams } from "../../core"
import { register } from "./events.register"

/**
 * Events Helper types
 */
export type AppEventListnerMap = EvMapParams
export type eventKeys = keyof typeof register
type EvMapParams = {
    [K in keyof typeof register]: ExtractParams<typeof register[K]>
}
