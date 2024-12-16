import type { Users } from "@/auth/model"
import { type Context, HttpStatus, BadRequestError, UnAuthorizedError } from "@/core"
import { AppMessages } from "@/core/common"
import { Program, ProgramNodes } from "@/programs/models"
import { type GetProgramNodesPayload } from "@/programs/payload_interfaces"

class GetProgramNodes {
    constructor(private readonly dbPrograms: typeof Program, private readonly dbProgramNodes: typeof ProgramNodes) {}

    handle = async ({ input, user, query }: Context<GetProgramNodesPayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { programId, category } = query

        if (!programId || !category) throw new BadRequestError("Invalid Params")

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const programNodes = await this.dbProgramNodes.findAll({
            where: {
                programId,
                category,
            },
        })

        return {
            code: HttpStatus.CREATED,
            message: AppMessages.SUCCESS.PROGRAM_NODE_FOUND,
            data: programNodes,
        }
    }
}

export const getProgramNodes = new GetProgramNodes(Program, ProgramNodes)
