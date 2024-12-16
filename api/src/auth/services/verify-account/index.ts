import { cache } from "@/app/app-cache"
import type { VerifyAccountPayload } from "@/auth/interfaces"
import { Users } from "@/auth/model/user.model"
import { HttpStatus, UnAuthorizedError, hashData, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"

class VerifyAccount {
    constructor(private readonly dbUser: typeof Users) {}

    handle = async ({ input }: Context<VerifyAccountPayload>) => {
        const { token, password } = input

        const email = await cache.get(token)

        if (!email) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        await cache.del(token)

        const user = await this.dbUser.findOne({
            where: { email, role: "USER" },
        })

        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        const hashPassword = await hashData(password)

        await this.dbUser.update({ isVerified: true, password: hashPassword }, { where: { id: user.id } })

        logger.info("Verified User Successfully")

        return {
            code: HttpStatus.OK,
            message: "User Verified Successfully",
        }
    }
}

export const verifyUserAccount = new VerifyAccount(Users)
