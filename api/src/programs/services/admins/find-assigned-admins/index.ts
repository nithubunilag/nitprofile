import { type Context, HttpStatus, BadRequestError } from "@/core"
import { AppMessages } from "@/core/common"
import { Program } from "@/programs/models"
import { type FindSingleProgram } from "@/programs/payload_interfaces"

class FindAssignedAdmins {
    constructor(private readonly dbPrograms: typeof Program) {}

    handle = async ({ query }: Context<FindSingleProgram>) => {
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

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: assignedAdmins ?? [],
        }
    }
}

export const findProgramAssignedAdmins = new FindAssignedAdmins(Program)
