import React from "react"
import { SceneContext } from "../context"

export const useSceneContext = () => {
    const { state, dispatch } = React.useContext(SceneContext)

    return { state, dispatch }
}
