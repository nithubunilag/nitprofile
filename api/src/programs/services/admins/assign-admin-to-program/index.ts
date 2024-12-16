import { Users } from "@/auth/model"
import { type Context, HttpStatus, BadRequestError, logger, UnAuthorizedError } from "@/core"
import { AppMessages } from "@/core/common"
import { AdminsAssignedPrograms, Program } from "@/programs/models"
import { type AssignAdminToProgramPayload } from "@/programs/payload_interfaces"

class AssignAdminToProgram {
    constructor(private readonly dbPrograms: typeof Program, private readonly dbAdminAssignedPrograms: typeof AdminsAssignedPrograms) {}

    handle = async ({ input }: Context<AssignAdminToProgramPayload>) => {
        const { adminId, programId } = input

        const programExists = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!programExists) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const existingUser = await Users.findOne({
            where: { id: adminId, role: "ADMIN" },
        })

        if (!existingUser) throw new UnAuthorizedError('This admin doesnt exist')

        const adminAssigned = await this.dbAdminAssignedPrograms.findOne({
            where: {
                programId,
                userId: adminId,
            },
        })

        if (adminAssigned) throw new UnAuthorizedError("Admin is already assigned to this program")

        await this.dbAdminAssignedPrograms.create({
            userId: adminId,
            programId,
        })

        const SUCCESS_MESSAGE = `Admin ${existingUser.firstName} assigned to program ${programExists.name} successfully`

        logger.info(SUCCESS_MESSAGE)

        return {
            code: HttpStatus.CREATED,
            message: SUCCESS_MESSAGE,
        }
    }
}

export const assignAdminToProgram = new AssignAdminToProgram(Program, AdminsAssignedPrograms)
