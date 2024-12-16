/**
 * Represents the base action type.
 * @template T - The action type.
 * @template P - The payload type.
 */
export type IBaseAction<T extends string, P = undefined> = P extends undefined ? { type: T } : { type: T; payload: P }

/**
 * Represents the union of all possible actions in the scene.
 */
export type Actions<T extends Record<string, { type: string }>> = T[keyof T]

/**
 * Represents the handlers for each action type.
 */
export type ReducerHandlers<K, T extends Record<string, { type: string }>> = {
    [key in Actions<T>["type"]]: (state: K, action: Extract<Actions<T>, { type: key }>) => K
}
