import { HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"

import { create_user } from "@/auth/helpers/user"

import { cache } from "@/app/app-cache"
import type { AcceptAdminInvitationPayload } from "@/auth/interfaces"

class AcceptInvitation {
    constructor() {}

    handle = async ({ input, query }: Context<AcceptAdminInvitationPayload>) => {
        const { token } = query

        const email = await cache.get(token)

        if (!email) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const created_user = await create_user._create_single_user({ ...input, email, role: "ADMIN", isVerified: true })

        await cache.del(token)

        logger.info(`User with email ${email} invited successfully`)

        const { password, refreshToken, refreshTokenExp, ...responsePayload } = created_user.dataValues

        return {
            code: HttpStatus.CREATED,
            message: `User with email ${email} invited successfully`,
            data: responsePayload,
        }
    }
}

export const acceptInvitation = new AcceptInvitation()
