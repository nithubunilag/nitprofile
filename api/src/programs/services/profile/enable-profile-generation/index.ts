import { dispatch } from "@/app"
import type { Users } from "@/auth/model"
import { type Context, HttpStatus, BadRequestError, UnAuthorizedError, ForbiddenError } from "@/core"
import { AppMessages } from "@/core/common"
import { AdminsAssignedPrograms, Program, ProgramNodes, UserPrograms } from "@/programs/models"
import { type FindSingleProgram } from "@/programs/payload_interfaces"
import { isProgramProfileValid } from "@/programs/utils"

class EnableProfileGeneration {
    constructor(
        private readonly dbAdminPrograms: typeof AdminsAssignedPrograms,
        private readonly dbPrograms: typeof Program,
        private readonly dbProgramNodes: typeof ProgramNodes,
        private readonly dbUserPrograms: typeof UserPrograms,
    ) {}

    handle = async ({ user, query }: Context<FindSingleProgram>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { programId } = query

        const program = await this.dbPrograms.findOne({ where: { id: programId } })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        if (program.profileGenerationAvailable) {
            return {
                code: HttpStatus.OK,
                message: AppMessages.SUCCESS.PROFILE_GENERATION_AVAILABLE,
                data: program,
            }
        }

        if (!isProgramProfileValid(program)) {
            throw new BadRequestError(AppMessages.FAILURE.PROFILE_GENERATION_NOT_AVAILABLE)
        }

        const assignedAdmins = await program?.getAssignedAdmins({
            attributes: {
                exclude: ["refreshToken", "refreshTokenExp", "password"],
            },
        })

        const isAdminAssigned = assignedAdmins?.find((admin: Users) => admin?.id === user.id) || program.createdBy === user.id

        if (!isAdminAssigned) throw new ForbiddenError(AppMessages.FAILURE.FORBIDDEN_PROGRAM)

        const programNodes = await this.dbProgramNodes.findAll({ where: { programId } })

        if (!programNodes || programNodes.length === 0) throw new BadRequestError(AppMessages.FAILURE.PROFILE_GENERATION_NOT_AVAILABLE)

        program.profileGenerationAvailable = true

        await program.save()

        const programUsers = await this.dbUserPrograms.findAll({
            where: {
                programId: query.programId,
            },
        })

        const users: string[] = programUsers.map((user) => user.id)

        // dispatch("event:newNotification", {
        //     actor: { id: user.id },
        //     entity_type: "PROFILE_AVAILABLE",
        //     item_id: programId,
        //     message: `Profile Generation for Program ${program.name} is now Available.`,
        //     notifier: users,
        // })

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.PROFILE_GENERATION_AVAILABLE,
            data: program,
        }
    }
}

export const enableProfileGeneration = new EnableProfileGeneration(AdminsAssignedPrograms, Program, ProgramNodes, UserPrograms)
