import { ControlBuilder } from "@/core/middlewares/controlBuilder"
import { assignAdminToProgram, findProgramAssignedAdmins } from "@/programs/services/admins"
import { createProgram, deleteProgram, findPrograms, getProgramMetrics, updateProgram } from "@/programs/services/core"
import { addProgramProfileFrame, enableProfileGeneration, generateProfile, previewProfile } from "@/programs/services/profile"
import { createProgramNodes, getProgramNodes } from "@/programs/services/program_nodes"
import { findProgramUsers, registerProgramUsers, resendUserMail } from "@/programs/services/users"
import { Router } from "express"
import {
    addProgramCertificateFrameSchema,
    addProgramProfileFrameSchema,
    assignAdminToProgramSchema,
    createProgramNodeSchema,
    createProgramSchema,
    createProgramUserSchema,
    findProgramSchema,
    getProgramNodesSchems,
    resendProgramUserMailSchema,
    updateProgramSchema,
} from "./schema"
import { addProgramCertificateFrame, enableCertificateGeneration, generateCertificate, previewcertificate } from "../services/certificate"


export const programRouter = Router()

// Create a program
programRouter
    .route("/")
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(findPrograms.findAll)
        .isPrivate()
        .handle()
    )
    .post(
        ControlBuilder.builder()
        .setValidator(createProgramSchema)
        .setHandler(createProgram.handle)
        .only("ADMIN","SUPER ADMIN")
        .isPrivate()
        .handle()
    )
    .put(
        ControlBuilder.builder()
        .setValidator(updateProgramSchema)
        .setHandler(updateProgram.handle)
        .only("ADMIN","SUPER ADMIN")
        .isPrivate()
        .handle()
    )
    .delete(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(deleteProgram.handle)
        .only("ADMIN","SUPER ADMIN")
        .isPrivate()
        .handle()
    )

programRouter.get(
    "/metrics",  
    ControlBuilder.builder()
    .setValidator(findProgramSchema)
    .setHandler(getProgramMetrics.handle)
    .only("ADMIN","SUPER ADMIN")
    .isPrivate()
    .handle()
)
programRouter
    .route("/users")
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(findProgramUsers.handle)
        .isPrivate()
        .handle()
    )
    .post(
        ControlBuilder.builder()
        .setValidator(createProgramUserSchema)
        .setHandler(registerProgramUsers.handle)
        .only("ADMIN","SUPER ADMIN")
        .isPrivate()
        .handle()
    )
    .put(
        ControlBuilder.builder()
        .setValidator(resendProgramUserMailSchema)
        .setHandler(resendUserMail.handle)
        .only("ADMIN","SUPER ADMIN")
        .isPrivate()
        .handle()
    )
programRouter
    .route("/user")
    .get(
        ControlBuilder.builder()
        .setHandler(findProgramUsers.findUser)
        .isPrivate()
        .handle()
    )
    
    

programRouter
    .route("/assign-admin")
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(findProgramAssignedAdmins.handle)
        .only("SUPER ADMIN")
        .isPrivate()
        .handle()
    )
    .post(
        ControlBuilder.builder()
        .setValidator(assignAdminToProgramSchema)
        .setHandler(assignAdminToProgram.handle)
        .only("SUPER ADMIN")
        .isPrivate()
        .handle()
    )

programRouter
    .route("/profile")
    .post(
        ControlBuilder.builder()
        .setValidator(addProgramProfileFrameSchema)
        .setHandler(addProgramProfileFrame.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(generateProfile.handle)
        .only("SUPER ADMIN", "USER")
        .isPrivate()
        .handle()
    )
    .put(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(enableProfileGeneration.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )

programRouter
    .route("/profile/preview")
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(previewProfile.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )

programRouter
    .route("/certificate")
    .post(
        ControlBuilder.builder()
        .setValidator(addProgramCertificateFrameSchema)
        .setHandler(addProgramCertificateFrame.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(generateCertificate.handle)
        .only("SUPER ADMIN", "USER")
        .isPrivate()
        .handle()
    )
    .put(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(enableCertificateGeneration.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )

programRouter
    .route("/certificate/preview")
    .get(
        ControlBuilder.builder()
        .setValidator(findProgramSchema)
        .setHandler(previewcertificate.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )




programRouter
    .route("/node")
    .post(
        ControlBuilder.builder()
        .setValidator(createProgramNodeSchema)
        .setHandler(createProgramNodes.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )
    .get(
        ControlBuilder.builder()
        .setValidator(getProgramNodesSchems)
        .setHandler(getProgramNodes.handle)
        .only("SUPER ADMIN", "ADMIN")
        .isPrivate()
        .handle()
    )




    