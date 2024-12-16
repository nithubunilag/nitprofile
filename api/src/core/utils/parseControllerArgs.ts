import type { Request } from "express"
import type { FileObjects, RequestFileContents } from "../types"
import type { FileArray } from "express-fileupload"

class ParseContextArgs {
    parse = (req: Request) => {
        return {
            input: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers,
            user: req.user,
            files: ParseContextArgs.parseFileContents(req.files),
        }
    }

    private static parseFileContents = (files: FileArray | null | undefined): FileObjects | null => {
        if (!files) return null

        const fileObjects: FileObjects = {}

        for (let key in files) {
            const file = files[key] as RequestFileContents | RequestFileContents[]

            fileObjects[key] = file
        }

        return fileObjects
    }
}

export default new ParseContextArgs()
