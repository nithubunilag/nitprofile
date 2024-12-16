import { type Context, HttpStatus, UnAuthorizedError, BadRequestError } from "@/core"
import { AppMessages } from "@/core/common"
import { Program, UserPrograms } from "@/programs/models"
import { type FindSingleProgram } from "@/programs/payload_interfaces"

class GetProgramMetrics {
    constructor(private readonly dbPrograms: typeof Program, private readonly dbUserPrograms: typeof UserPrograms) {}

    handle = async ({ query, user }: Context<FindSingleProgram>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const program = await this.dbPrograms.findOne({
            where: {
                id: query.programId,
            },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const noOfProfilesGenerated = await this.dbUserPrograms.count({
            where: {
                profileGenerationDate: {
                    $ne: null,
                },
            },
        })

        const noOfCertificatesGenerated = await this.dbUserPrograms.count({
            where: {
                certificateGenerationDate: {
                    $ne: null,
                },
            },
        })

        const programUsers = await program?.getRegisteredUsers({
            attributes: {
                exclude: ["refreshToken", "refreshTokenExp", "password"],
            },
        })

        const noOfVerifiedUsers = programUsers.filter((item) => item.isVerified).length

        console.log(noOfCertificatesGenerated, noOfProfilesGenerated, noOfVerifiedUsers)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: { noOfProfilesGenerated, noOfVerifiedUsers, noOfCertificatesGenerated },
        }
    }
}

export const getProgramMetrics = new GetProgramMetrics(Program, UserPrograms)
