import { BadRequestError, HttpStatus, UnAuthorizedError, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { Program, UserPrograms } from "@/programs/models"
import { type FindSingleProgram } from "@/programs/payload_interfaces"

class FindProgramUsers {
    constructor(private readonly dbPrograms: typeof Program, private readonly dbUserPrograms: typeof UserPrograms) {}

    handle = async ({ user, query }: Context<FindSingleProgram>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const program = await this.dbPrograms.findOne({
            where: {
                id: query.programId,
            },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const programUsers = await program?.getRegisteredUsers({
            where: {
                role: "USER",
            },
            attributes: {
                exclude: ["refreshToken", "refreshTokenExp", "password"],
            },
        })

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: programUsers ?? [],
        }
    }

    findUser = async ({ user }: Context<FindSingleProgram>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const userPrograms = await this.dbUserPrograms.findAll({
            where: {
                userId: user?.id,
            },
        })
        console.log(userPrograms)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: userPrograms ?? [],
        }
    }
}

export const findProgramUsers = new FindProgramUsers(Program, UserPrograms)
