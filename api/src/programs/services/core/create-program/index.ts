import { Users } from "@/auth/model"
import { BadRequestError, HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { Program } from "@/programs/models"
import { type CreateProgramPayload } from "@/programs/payload_interfaces"

class CreateProgram {
    constructor(private readonly dbPrograms: typeof Program) {}

    handle = async ({ input, user }: Context<CreateProgramPayload>) => {
        const { endDate, name, startDate } = input

        const programExists = await this.dbPrograms.findOne({
            where: { name },
        })

        if (programExists) throw new BadRequestError("Program with Name Already Exists!")

        const existingUser = await Users.findOne({
            where: { id: user?.id },
        })

        if (!existingUser) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        if (startDate < new Date(Date.now())) throw new BadRequestError(AppMessages.FAILURE.START_DATE_ERROR)

        if (endDate < startDate) throw new BadRequestError(AppMessages.FAILURE.DATE_DURATION_ERROR)

        const createdProgram = await this.dbPrograms.create({ ...input, createdBy: existingUser?.id })

        logger.info(`Program with ID ${createdProgram.id} created successfully`)

        return {
            code: HttpStatus.CREATED,
            message: AppMessages.SUCCESS.PROGRAM_CREATED,
            data: createdProgram,
        }
    }
}

export const createProgram = new CreateProgram(Program)
