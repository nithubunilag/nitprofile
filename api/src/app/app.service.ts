import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"

import { appRouter } from "@/app"
import { corsOptions, errorHandler, notFoundHandler } from "@/core"

export const app = express()

app.use(express.json())

app.use(cookieParser())
// app.use(globalRateLimiter)
app.use(
    fileUpload({
        useTempFiles: true,
    }),
)

app.use(cors(corsOptions))
app.use(express.static("public"))
// app.use(compression())
app.use(express.urlencoded({ extended: false }))
app.use("/api/v1", appRouter)

app.use(notFoundHandler.handle)
app.use(errorHandler.handle)
