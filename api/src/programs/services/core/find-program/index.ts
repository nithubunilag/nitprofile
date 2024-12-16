import { ForbiddenError, HttpStatus, UnAuthorizedError, type Context, type IAuthRoles } from "@/core"
import { AppMessages } from "@/core/common"
import { AdminsAssignedPrograms, Program, UserPrograms } from "@/programs/models"
import { type FindSingleProgram } from "@/programs/payload_interfaces"

interface IFindOneProgram {
    userId: string
    userRole: IAuthRoles
    programId: string
}

class FindPrograms {
    constructor(
        private readonly dbPrograms: typeof Program,
        private readonly dbAdminPrograms: typeof AdminsAssignedPrograms,
        private readonly dbUserPrograms: typeof UserPrograms,
    ) {}

    findAll = async ({ query, user }: Context<FindSingleProgram>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const { programId } = query

        const userRole = user?.role

        if (programId)
            return this._findOne({
                programId: programId,
                userId: user!.id,
                userRole: userRole!,
            })

        if (userRole === "ADMIN") return this._findForAdmins(user!.id)

        if (userRole === "USER") return this._findForUsers(user!.id)

        const allPrograms = await this.dbPrograms.findAll()

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: allPrograms,
        }
    }

    private _findOne = async (data: IFindOneProgram) => {
        const { programId, userId, userRole } = data

        if (userRole === "ADMIN") {
            const adminProgram = await this.dbAdminPrograms.findOne({
                where: {
                    userId,
                    programId,
                },
            })

            if (!adminProgram) throw new ForbiddenError(AppMessages.FAILURE.FORBIDDEN_RESOURCE)
        }

        if (userRole === "USER") {
            const userProgram = await this.dbUserPrograms.findOne({
                where: {
                    userId,
                    programId,
                },
            })

            if (!userProgram) throw new ForbiddenError(AppMessages.FAILURE.FORBIDDEN_RESOURCE)
        }

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: program,
        }
    }

    private _findForUsers = async (userId: string) => {
        const userPrograms = await this.dbUserPrograms.findAll({
            where: {
                userId,
            },
        })

        const programs: Program[] = []

        await Promise.all(
            userPrograms.map(async (adminProgram) => {
                const program = await this.dbPrograms.findOne({
                    where: { id: adminProgram.programId },
                })

                if (program) {
                    programs.push(program)
                }
            }),
        )

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: programs,
        }
    }

    private _findForAdmins = async (userId: string) => {
        console.log("finding for admin")

        const adminPrograms = await this.dbAdminPrograms.findAll({
            where: {
                userId,
            },
        })

        const programs: Program[] = []

        await Promise.all(
            adminPrograms.map(async (adminProgram) => {
                const program = await this.dbPrograms.findOne({
                    where: { id: adminProgram.programId },
                })

                if (program) {
                    programs.push(program)
                }
            }),
        )

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.DATA_FETCHED,
            data: programs,
        }
    }
}

export const findPrograms = new FindPrograms(Program, AdminsAssignedPrograms, UserPrograms)
