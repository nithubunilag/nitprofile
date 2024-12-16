import { Users } from "@/auth/model"
import { BadRequestError, HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import type { UpdateProfilePayload } from "@/user/interfaces"

class UpdateProfile {
    constructor(private readonly dbUser: typeof Users) {}

    handle = async ({ input, user }: Context<UpdateProfilePayload>) => {
        if (!input) throw new BadRequestError("No Input Passed")

        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const existingUser = await this.dbUser.findOne({ where: { id: user.id } })

        if (!existingUser) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        await this.dbUser.update(
            { ...input },
            {
                where: {
                    id: existingUser.id,
                },
            },
        )

        logger.info(`User with ID ${existingUser.id} updated successfully`)

        return {
            code: HttpStatus.OK,
            message: "Profile Updated Successfully",
        }
    }
}

export const updateProfile = new UpdateProfile(Users)
