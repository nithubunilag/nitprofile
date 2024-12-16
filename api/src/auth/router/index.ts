import { Router } from "express"
import { ControlBuilder } from "@/core/middlewares/controlBuilder"
import { signInSchema, acceptInvitationSchema, forgotPasswordSchema, inviteAdminSchema, resetPasswordSchema, verifyAccount } from "./schema"
import { signIn, forgotPassword, resetPassword, refreshToken, acceptInvitation, inviteAdmin, signOut, verifyUserAccount } from "../services"

export const authRouter = Router()

authRouter.post(
    "/verify-account", 
    ControlBuilder.builder()
    .setValidator(verifyAccount)
    .setHandler(verifyUserAccount.handle)    
    .handle()
)

authRouter.post(
    "/sign-in", 
    ControlBuilder.builder()
    .setValidator(signInSchema)
    .setHandler(signIn.handle)
    .handle()
)

authRouter.post(
    "/forgot-password", 
    ControlBuilder.builder()
    .setValidator(forgotPasswordSchema)
    .setHandler(forgotPassword.handle)
    .handle()
)

authRouter.post(
    "/reset-password", 
    ControlBuilder.builder()
    .setValidator(resetPasswordSchema)
    .setHandler(resetPassword.handle)
    .handle()
)

authRouter.get(
    "/refresh-token", 
    ControlBuilder.builder()
    .setHandler(refreshToken.handle)
    .handle()
)

authRouter.post(
    "/invite-admin",
    ControlBuilder.builder()
    .isPrivate()
    .setValidator(inviteAdminSchema)
    .setHandler(inviteAdmin.handle)
    .only("SUPER ADMIN")
    .handle(),
)

authRouter.post(
    "/accept-admin-invite", 
    ControlBuilder.builder()
    .setValidator(acceptInvitationSchema)
    .setHandler(acceptInvitation.handle)
    .handle()
)

authRouter.post(
    "/sign-out", 
    ControlBuilder.builder()
    .setHandler(signOut.handle)
    .isPrivate()
    .handle()
)
