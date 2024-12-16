import { RefObject, useCallback, useEffect, useRef, useState } from "react"

export const useSnapshotDimensions = (ref: RefObject<HTMLImageElement>) => {
    const snapshot = useRef({ width: 0, height: 0 })

    const [, updateState] = useState<any>();
    const forceRerender = useCallback(() => updateState({}), []);

    useEffect(() => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()

        snapshot.current.width = rect.width
        snapshot.current.height = rect.height
    })

    return {
        containerWidth: snapshot.current.width,
        containerHeight: snapshot.current.height,
        forceRerender
    }
}
