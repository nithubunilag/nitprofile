import { Users } from "@/auth/model"
import { BadRequestError, HttpStatus, UnAuthorizedError, generateCloudinaryTransformationImage, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { formatNode } from "@/programs/helpers/formatNode"
import { AdminsAssignedPrograms, Program, ProgramNodes } from "@/programs/models"
import { type GenerateProgramProfilePayload } from "@/programs/payload_interfaces"
import type { NodePayload } from "@/programs/types"

class PreviewCertificate {
    constructor(
        private readonly dbPrograms: typeof Program,
        private readonly dbAdminPrograms: typeof AdminsAssignedPrograms,
        private readonly dbProgramNodes: typeof ProgramNodes,
        private readonly dbUser: typeof Users,
    ) {}

    handle = async ({ query, user }: Context<GenerateProgramProfilePayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { programId } = query

        const adminProgram = await this.dbAdminPrograms.findOne({
            where: { userId: user.id, programId },
        })

        if (!adminProgram && user.role !== "SUPER ADMIN") throw new BadRequestError("You are not registered for this program")

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const programNodes = await this.dbProgramNodes.scope("").findAll({
            where: { programId, category:"certificate" },
        })

        const existingUser = await this.dbUser.findOne({ where: { id: user.id } })

        if (!existingUser) throw new BadRequestError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        if (!program.certificateFrameSecureUrl) throw new BadRequestError("No Certificate Frame Uploaded!")

        let certificate_url

        if (!programNodes.length) {
            certificate_url = program.certificateFrameSecureUrl
        }

        if (programNodes.length) {
            const refactoredNodes: NodePayload[] = []

            await Promise.all(
                programNodes.map(async (node) => {
                    if (node.type === "image" && !node.overlay) {
                        node.overlay = `Nithub/NITPROFILE_ASSETS/DUMMYAVATAR-1960922999`.replace(/\//g, ":")
                    }

                    const formattedNode = await formatNode.format_node(node, {
                        programId: program.id,
                        userId: user.id,
                    })

                    refactoredNodes.push(formattedNode as NodePayload)
                }),
            )

            certificate_url = generateCloudinaryTransformationImage({
                framePublicId: program.certificateFramePublicId,
                height: program.certificateFrameHeight,
                nodes: refactoredNodes,
                width: program.certificateFrameWidth,
            })
        }

        logger.info(`Certificate for Program ${program.id} Previewed successfully`)

        return {
            code: HttpStatus.OK,
            message: "Certificate for User Previewed successfully",
            data: certificate_url,
        }
    }
}

export const previewcertificate = new PreviewCertificate(Program, AdminsAssignedPrograms, ProgramNodes, Users)
