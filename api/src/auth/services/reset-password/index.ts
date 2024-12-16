import { HttpStatus, logger, type Context, ForbiddenError, hashData, isDateExpired } from "@/core"
import type { ResetPasswordPayload } from "@/auth/interfaces"
import { AppMessages } from "@/core/common"
import { Users } from "@/auth/model/user.model"

class ResetPassword {
    constructor(private readonly dbUser: typeof Users) {}

    handle = async ({ input }: Context<ResetPasswordPayload>) => {
        const { password, resetToken } = input

        const user = await this.dbUser.findOne({ where: { resetToken } })

        if (!user) throw new ForbiddenError("Invalid or Expired token")

        if (!user.resetToken || !user.resetTokenExpiresIn || isDateExpired(user?.resetTokenExpiresIn)) {
            throw new ForbiddenError("Token Expired, request a new password reset mail")
        }

        const hashedPassword = await hashData(password)

        user.password = hashedPassword

        user.resetToken = null

        user.resetTokenExpiresIn = null

        await user.save()

        logger.info("Successfully Reset Password")

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.PASSWORD_RESET,
        }
    }
}

export const resetPassword = new ResetPassword(Users)
