import { Users } from "@/auth/model"
import { AppMessages } from "@/core/common"
import { type Context, HttpStatus, BadRequestError, Joi, generateRandStr, currentOrigin } from "@/core"
import { Program, UserPrograms } from "@/programs/models"
import { type ResendUserMailPayload } from "@/programs/payload_interfaces"
import { cache } from "@/app/app-cache"
import { programAcceptanceMail, sendEmail } from "@/mails"

class ResendUserMail {
    constructor(
        private readonly dbPrograms: typeof Program,
        private readonly dbUsers: typeof Users,
        private readonly dbUserPrograms: typeof UserPrograms,
    ) {}

    handle = async ({ input, query }: Context<ResendUserMailPayload>) => {
        const { email } = input
        const { programId } = query

        const program = await this.dbPrograms.findOne({
            where: { id: programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        let existingUser = await this.dbUsers.findOne({
            where: { email },
        })

        if (!existingUser) throw new BadRequestError(`Invalid User -  ${email}`)

        const userProgramExists = await this.dbUserPrograms.findOne({
            where: { userId: existingUser.id, programId: program.id },
        })

        if (!userProgramExists) throw new BadRequestError("User is not registered for this program")

        const inviteToken = generateRandStr(64)

        await cache.set(inviteToken, email, "EX", 6000)

        console.log(inviteToken, 'sent Token')

        const sentMail = await sendEmail({
            to: email,
            subject: "Confirmation Email",
            body: programAcceptanceMail({
                lastName: existingUser.lastName,
                firstName: existingUser.firstName,
                programName: program.name,
                link: `${currentOrigin}/auth/verify-account?token=${inviteToken}`,
            }),
        })

        if (!sentMail) throw new BadRequestError("Error Sending Mail")

        this.dbUserPrograms.update({ acceptanceMailSent: true }, { where: { userId: existingUser.id, programId } })

        return {
            code: HttpStatus.CREATED,
            message: `Mail Resent to ${email} Successfully`
        }
    }
}

export const resendUserMail = new ResendUserMail(Program, Users, UserPrograms)
