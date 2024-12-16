import { type Context, HttpStatus, BadRequestError, logger } from "@/core"
import { AppMessages } from "@/core/common"
import { Program } from "@/programs/models"
import { type UpdateProgramPayload } from "@/programs/payload_interfaces"

interface IDateValidator {
    requestStartDate: Date | undefined
    requestEndDate: Date | undefined
    dbStartDate: Date
    dbEndDate: Date
}

class UpdateProgram {
    constructor(private readonly dbPrograms: typeof Program) {}

    handle = async ({ input, query }: Context<UpdateProgramPayload>) => {
        const { startDate, endDate } = input

        const { programId } = query

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        if (startDate || endDate) {
            this._validateDates({
                dbEndDate: program.endDate,
                dbStartDate: program.startDate,
                requestEndDate: endDate,
                requestStartDate: startDate,
            })
        }

        await this.dbPrograms.update(input, { where: { id: programId } })

        logger.info(`Program with ID ${programId} Updated successfully`)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.PROGRAM_UPDATED,
        }
    }

    private _validateDates = (data: IDateValidator) => {
        const { dbEndDate, dbStartDate, requestEndDate, requestStartDate } = data

        if (requestStartDate && requestStartDate < new Date(Date.now())) {
            throw new BadRequestError(AppMessages.FAILURE.START_DATE_ERROR)
        }

        if (requestStartDate && requestEndDate && dbEndDate < requestStartDate) {
            throw new BadRequestError(AppMessages.FAILURE.DATE_DURATION_ERROR)
        }

        if (requestStartDate && !requestEndDate && dbEndDate < requestStartDate) {
            throw new BadRequestError(AppMessages.FAILURE.DATE_DURATION_ERROR)
        }

        if (requestEndDate && !requestStartDate && dbEndDate < dbStartDate) {
            throw new BadRequestError(AppMessages.FAILURE.DATE_DURATION_ERROR)
        }
    }
}

export const updateProgram = new UpdateProgram(Program)
