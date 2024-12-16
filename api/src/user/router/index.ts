import { ControlBuilder } from "@/core/middlewares/controlBuilder"
import { updateProfile, updateProfilePicture } from "@/user/services"
import { Router } from "express"
import { updateprofileSchema } from "./schema"

export const profileRouter = Router()

profileRouter.put(
    "/update-pfp", 
    ControlBuilder.builder()
    .setHandler(updateProfilePicture.handle)
    .isPrivate()
    .handle()
)


profileRouter.put(
    "/update-profile", 
    ControlBuilder.builder()
    .setValidator(updateprofileSchema)
    .setHandler(updateProfile.handle)
    .isPrivate()
    .handle()
)




