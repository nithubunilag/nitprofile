import { dispatch } from "@/app"
import type { ForgotPasswordPayload } from "@/auth/interfaces"
import { Users } from "@/auth/model/user.model"
import { HttpStatus, computeExpiryDate, currentOrigin, generateRandStr, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { forgotPasswordMail } from "@/mails"

class ForgotPassword {
    constructor(private readonly dbUser: typeof Users) {}

    handle = async ({ input }: Context<ForgotPasswordPayload>) => {
        const { email } = input

        const user = await this.dbUser.findOne({ where: { email } })

        if (!user) {
            return {
                code: HttpStatus.OK,
                message: `${AppMessages.SUCCESS.EMAIL_SENT} ${email}`,
            }
        }

        const token = generateRandStr(64)

        user.resetToken = token

        const expDate = computeExpiryDate(1800)

        user.resetTokenExpiresIn = expDate

        await user.save()

        dispatch("event:sendMail", {
            to: email,
            subject: "Forgot Password",
            body: forgotPasswordMail({
                lastName: user.lastName,
                firstName: user.firstName,
                link: `${currentOrigin}/auth/reset-password?resetToken=${token}`,
            }),
        })

        logger.info("Successfully Sent Mail")

        return {
            code: HttpStatus.OK,
            message: `${AppMessages.SUCCESS.EMAIL_SENT} ${email}`,
        }
    }
}

export const forgotPassword = new ForgotPassword(Users)
