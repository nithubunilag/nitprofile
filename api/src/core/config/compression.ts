import compression from "compression"
import type { CompressionOptions } from "compression"

export const compressionOptions: CompressionOptions = {
    level: 1,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
            return false
        }

        return compression.filter(req, res)
    },
}
