import { BadRequestError, HttpStatus, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { AdminsAssignedPrograms, Program, ProgramNodes, UserPrograms } from "@/programs/models"
import { type FindSingleProgram } from "@/programs/payload_interfaces"

class DeleteProgram {
    constructor(
        private readonly dbPrograms: typeof Program,
        private readonly dbProgramNodes: typeof ProgramNodes,
        private readonly AdminPrograms: typeof AdminsAssignedPrograms,
        private readonly RegisteredProgramsUsers: typeof UserPrograms,
    ) {}

    handle = async ({ query, user }: Context<FindSingleProgram>) => {
        const { programId } = query

        const programExists = await this.dbPrograms.findOne({
            where: { id: programId, createdBy: user?.id },
        })

        if (!programExists) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        await this.dbProgramNodes.destroy({
            where: {
                programId,
            },
        })

        await this.AdminPrograms.destroy({
            where: {
                programId,
            },
        })

        await this.RegisteredProgramsUsers.destroy({
            where: {
                programId,
            },
        })

        await this.dbPrograms.destroy({
            where: { id: programId, createdBy: user?.id },
        })

        logger.info(`Program with ID ${programId} deleted successfully`)

        return {
            code: HttpStatus.NO_CONTENT,
            message: "Program was deleted Successfully",
        }
    }
}

export const deleteProgram = new DeleteProgram(Program, ProgramNodes, AdminsAssignedPrograms, UserPrograms)
