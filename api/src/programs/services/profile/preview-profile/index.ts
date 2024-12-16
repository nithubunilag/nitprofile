import { Users } from "@/auth/model"
import { BadRequestError, HttpStatus, UnAuthorizedError, generateCloudinaryTransformationImage, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { formatNode } from "@/programs/helpers/formatNode"
import { AdminsAssignedPrograms, Program, ProgramNodes } from "@/programs/models"
import { type GenerateProgramProfilePayload } from "@/programs/payload_interfaces"
import type { NodePayload } from "@/programs/types"

class PreviewProfile {
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
            where: { programId, category:"profile" },
        })

        const existingUser = await this.dbUser.findOne({ where: { id: user.id } })

        if (!existingUser) throw new BadRequestError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        if (!program.profileFrameSecureUrl) throw new BadRequestError("No Profile Frame Uploaded!")

        let profile_url

        if (!programNodes.length) {
            profile_url = program.profileFrameSecureUrl
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

            profile_url = generateCloudinaryTransformationImage({
                framePublicId: program.profileFramePublicId,
                height: program.profileFrameHeight,
                nodes: refactoredNodes,
                width: program.profileFrameWidth,
            })
        }

        logger.info(`Profile for Program ${program.id} Previewed successfully`)

        return {
            code: HttpStatus.OK,
            message: "Profile for User Previewed successfully",
            data: profile_url,
        }
    }
}

export const previewProfile = new PreviewProfile(Program, AdminsAssignedPrograms, ProgramNodes, Users)
