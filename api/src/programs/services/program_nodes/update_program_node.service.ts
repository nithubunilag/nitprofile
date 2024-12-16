import { type Context, HttpStatus, BadRequestError, logger, UnAuthorizedError } from "@/core"
import { AppMessages } from "@/core/common"
import { ProgramNodes } from "@/programs/models"
import { type UpdateProgramNodePayload } from "@/programs/payload_interfaces"

class UpdateProgramNodes {
    constructor(private readonly dbProgramNodes: typeof ProgramNodes) {}

    handle = async ({ input, user, query }: Context<UpdateProgramNodePayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { node } = input

        const { id } = query

        const programNode = await this.dbProgramNodes.findOne({
            where: {
                id,
            },
        })

        if (!programNode) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM_NODE)

        await this.dbProgramNodes.update({ ...node }, { where: { id } })

        logger.info(`Program Node with ID ${id} updated successfully`)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.PROGRAM_NODE_UPDATED,
        }
    }
}

export const updateProgramNode = new UpdateProgramNodes(ProgramNodes)
