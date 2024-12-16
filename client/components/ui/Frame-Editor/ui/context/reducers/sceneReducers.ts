import { Canvas, Object } from "fabric/fabric-impl"
import { ISceneState } from ".."
import { IBaseAction, ReducerHandlers, Actions } from "./interfaces"

/**
 * Represents the action types available in the scene.
 */
type ActionTypes = {
    initialize_canvas: IBaseAction<"initialize_canvas", { canvas: Canvas }>
    clear_canvas: IBaseAction<"clear_canvas">
    select_object: IBaseAction<"select_object", { item: Object }>
    deselect_object: IBaseAction<"deselect_object">
}

type SceneActions = Actions<ActionTypes>

type SceneReducerHandler = ReducerHandlers<ISceneState, ActionTypes>

/**
 * Contains the reducer functions for each action type.
 */
const reducerHandlers: SceneReducerHandler = {
    /**
     * Reducer function for initializing the canvas.
     * @param {InitialStateType} state - The current state.
     * @param {IBaseAction<"initialize_canvas", { canvas: Canvas }>} action - The initialize_canvas action.
     * @returns {InitialStateType} The updated state.
     */
    initialize_canvas: (state, action) => {
        return { ...state, canvas: action.payload.canvas }
    },


    /**
     * Reducer function for clearing the canvas.
     * @param {InitialStateType} state - The current state.
     * @returns {InitialStateType} The updated state.
     */
    clear_canvas: (state) => {
        return { ...state, canvas: null }
    },

    /**
     * Reducer function for selecting an object on the canvas.
     * @param {InitialStateType} state - The current state.
     * @param {IBaseAction<"select_object", { item: Object }>} action - The select_object action.
     * @returns {InitialStateType} The updated state.
     */
    select_object: (state, action) => {
        return { ...state, selectedItem: action.payload.item }
    },

    /**
     * Reducer function for deselecting any selected object.
     * @param {InitialStateType} state - The current state.
     * @returns {InitialStateType} The updated state.
     */
    deselect_object: (state) => {
        return { ...state, selectedItem: null }
    },
}

/**
 * The main scene reducer function.
 * @param {InitialStateType} state - The current state.
 * @param {SceneActions} action - The action to be performed.
 * @returns {ISceneState} The updated state.
 */
const sceneReducer = (state: ISceneState, action: SceneActions): ISceneState => {
    if (reducerHandlers[action.type]) {
        return reducerHandlers[action.type](state, action as Extract<SceneActions, { type: keyof SceneActions }>)
    }

    return state
}

export { type SceneActions, sceneReducer }
