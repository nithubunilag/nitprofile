import { type Context, convertArrayToObject, UnAuthorizedError, config, HttpStatus } from "@/core"
import type { RefreshTokenPayload } from "@/auth/interfaces"
import { AppMessages } from "@/core/common"
import { Users } from "@/auth/model/user.model"
import { type TokenService, tokenService } from "@/auth/helpers/token"
import { encryptor } from "@/auth/helpers/encryptor"

class RefreshToken {
    constructor(private readonly dbUser: typeof Users, private readonly tokenService: TokenService) {}

    // Need to work on handling empty types

    handle = async ({ headers }: Context<RefreshTokenPayload>) => {
        const cookiesArr = headers.cookie?.split("; ")

        if (!cookiesArr || cookiesArr.length <= 0) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const cookies = convertArrayToObject(cookiesArr)

        try {
            if (cookies?.accessToken) {
                const decryptedAccessToken = encryptor.decrypt(cookies?.accessToken)

                const isAccessTokenValid = this.tokenService._verifyToken(decryptedAccessToken, config.auth.accessTokenSecret)

                if (isAccessTokenValid) {
                    return {
                        code: HttpStatus.OK,
                        message: AppMessages.SUCCESS.TOKEN_REFRESHED,
                    }
                }
            }
        } catch (error) {}

        const refreshToken = cookies?.refreshToken

        if (!refreshToken) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const payload = await this.tokenService.extractTokenDetails(refreshToken, config.auth.refreshTokenSecret)

        const [newAccessToken, newRefreshToken] = await this.tokenService.getTokens({
            email: payload.email,
            id: payload.id,
            role: payload.role,
        })

        await this.dbUser.update({ refreshToken, refreshTokenExp: new Date() }, { where: { id: payload.id } })

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.TOKEN_REFRESHED,
            headers: {
                "Set-Cookie": [`accessToken=${newAccessToken}; Path=/; HttpOnly`, `refreshToken=${newRefreshToken}; Path=/; HttpOnly`],
            },
        }
    }
}

export const refreshToken = new RefreshToken(Users, tokenService)
