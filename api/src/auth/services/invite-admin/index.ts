import { HttpStatus, logger, type Context, UnAuthorizedError, currentOrigin, generateRandStr } from "@/core"
import type { InviteAdminPayload } from "@/auth/interfaces"
import { AppMessages } from "@/core/common"
import { Users } from "@/auth/model/user.model"
import { dispatch } from "@/app"
import { adminInvitationMail } from "@/mails"
import { cache } from "@/app/app-cache"

class InviteAdmin {
    constructor(private readonly dbUser: typeof Users) {}

    handle = async ({ input }: Context<InviteAdminPayload>) => {
        const { email } = input

        const user = await this.dbUser.findOne({
            where: { email },
        })

        if (user) throw new UnAuthorizedError(AppMessages.FAILURE.EMAIL_EXISTS)

        const inviteToken = generateRandStr(64)

        await cache.set(inviteToken, email, "EX", 1200)

        dispatch("event:sendMail", {
            to: email,
            subject: "NITProfile Admin Invitation",
            body: adminInvitationMail({
                link: `${currentOrigin}/auth/accept-admin-invitation?token=${inviteToken}`,
            }),
        })

        logger.info(`Admin with email ${email} invited successfully`)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.ADMIN_INVITED,
        }
    }
}

export const inviteAdmin = new InviteAdmin(Users)
