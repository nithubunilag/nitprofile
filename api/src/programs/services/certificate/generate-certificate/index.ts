import { Users } from "@/auth/model"
import { BadRequestError, HttpStatus, UnAuthorizedError, generateCloudinaryTransformationImage, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { formatNode } from "@/programs/helpers/formatNode"
import { Program, ProgramNodes, UserPrograms } from "@/programs/models"
import { type GenerateProgramProfilePayload } from "@/programs/payload_interfaces"
import type { NodePayload } from "@/programs/types"

class GenerateCertificate {
    constructor(
        private readonly dbPrograms: typeof Program,
        private readonly dbUserPrograms: typeof UserPrograms,
        private readonly dbProgramNodes: typeof ProgramNodes,
        private readonly dbUser: typeof Users,
    ) {}

    handle = async ({ query, user }: Context<GenerateProgramProfilePayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { programId } = query

        const userProgram = await this.dbUserPrograms.findOne({
            where: { userId: user.id, programId },
        })

        if (!userProgram) throw new BadRequestError("You are not registered for this program")

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const existingUser = await this.dbUser.findOne({ where: { id: user.id } })

        if (!existingUser) throw new BadRequestError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const programNodes = await this.dbProgramNodes.scope("").findAll({
            where: { programId, category:"certificate" },
        })

        if (!program.certificateGenerationAvailable) {
            throw new BadRequestError(AppMessages.FAILURE.CERTIFICATE_GENERATION_NOT_AVAILABLE)
        }

        const profilePictureNode = programNodes.find((node) => node.type === "image" && node.overlay)

        if (profilePictureNode && !existingUser.profilePicPublicId) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROFILE_PICTURE)

        let certificate_url

        if (userProgram.certificateImageUrl && userProgram.certificateImageUrl.length > 20) certificate_url = userProgram.certificateImageUrl

        if (!userProgram.certificateImageUrl || userProgram.certificateImageUrl.length < 20 || existingUser.changed("profilePicSecureUrl")) {
            const refactoredNodes: NodePayload[] = []

            await Promise.all(
                programNodes.map(async (node) => {
                    if (node.type === "image" && !node.overlay) {
                        node.overlay = existingUser.profilePicPublicId!.replace(/\//g, ":")
                    }

                    const formattedNode = await formatNode.format_node(node, {
                        programId: program.id,
                        userId: existingUser.id,
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

            userProgram.certificateImageUrl = certificate_url

            userProgram.certificateGenerationDate = new Date()

            await userProgram.save()
        }


        if (!certificate_url) throw new BadRequestError("Could not Generate Certificate, Please try again")

        logger.info(`Certificate for User ${existingUser.id} Generated successfully`)

        return {
            code: HttpStatus.OK,
            message: "Certificate for User Generated successfully",
            data: certificate_url,
        }
    }
}

export const generateCertificate = new GenerateCertificate(Program, UserPrograms, ProgramNodes, Users)
