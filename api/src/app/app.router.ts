import { Router } from "express"
import { HttpStatus, authRateLimiter } from "@/core"
import { authRouter } from "@/auth"
import { programRouter } from "@/programs"
import { profileRouter } from "@/user"

export const appRouter = Router()

appRouter.use("/auth", authRouter)

appRouter.use("/programs", programRouter)

appRouter.use("/profile", profileRouter)

appRouter.get("/health", (_, res) => {
    res.status(HttpStatus.OK).json({
        message: "Api ups",
        version: "1.0",
    })
})
