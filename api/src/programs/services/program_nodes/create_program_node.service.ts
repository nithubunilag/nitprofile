import type { Users } from "@/auth/model"
import { type Context, HttpStatus, BadRequestError, logger, UnAuthorizedError, sequelize, ForbiddenError } from "@/core"
import { AppMessages } from "@/core/common"
import { Program, ProgramNodes } from "@/programs/models"
import { type CreateProgramNodesPayload } from "@/programs/payload_interfaces"
import { isProgramProfileValid } from "@/programs/utils"

class CreateProgramNodes {
    constructor(private readonly dbPrograms: typeof Program, private readonly dbProgramNodes: typeof ProgramNodes) {}

    handle = async ({ input, user, query }: Context<CreateProgramNodesPayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { nodes, category } = input

        const { programId } = query

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const assignedAdmins = await program?.getAssignedAdmins({
            attributes: {
                exclude: ["refreshToken", "refreshTokenExp", "password"],
            },
        })

        const isAdminAssigned = assignedAdmins?.find((admin: Users) => admin?.id === user.id) || program.createdBy === user.id

        if (!isAdminAssigned) throw new ForbiddenError("You are not assigned to this program")

        if (!isProgramProfileValid(program)) {
            throw new BadRequestError(
                "Node creation for this program is restricted until a profile or certificate frame is created within the program.",
            )
        }

        const dbTransaction = await sequelize.transaction()

        const createdNodes: ProgramNodes[] = []

        try {
            await Promise.all(
                nodes.map(async (node) => {
                    const createdNode = await this.dbProgramNodes.create({ ...node, programId, category }, { transaction: dbTransaction })

                    logger.info(`Program Node with ID ${createdNode.id} created successfully`)

                    createdNodes.push(createdNode)
                }),
            )

            dbTransaction.commit()
        } catch (error: any) {
            dbTransaction.rollback()

            logger.error(error?.message)

            throw new Error(error?.message ?? "Internal Server Error")
        }

        return {
            code: HttpStatus.CREATED,
            message: AppMessages.SUCCESS.PROGRAM_NODE_CREATED,
            data: createdNodes,
        }
    }
}

export const createProgramNodes = new CreateProgramNodes(Program, ProgramNodes)
