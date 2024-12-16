import { HttpStatus, compareHashedData, logger, type Context, UnAuthorizedError, ForbiddenError } from "@/core"
import { AppMessages } from "@/core/common"
import type { SignInPayload } from "@/auth/interfaces"
import { tokenService, type TokenService } from "@/auth/helpers/token"
import { Users } from "@/auth/model/user.model"

class SignIn {
    constructor(private readonly dbUser: typeof Users, private readonly tokenService: TokenService) {}

    /**
     * Handles user login, performs necessary validations, and generates tokens for authentication.
     *
     * @param {Context<SignInPayload>} params - The input parameters for user login.
     * @returns {Promise<ApiResponse>} The API response containing authentication tokens and user data.
     * @throws {UnAuthorizedError} Thrown if login credentials are invalid or user email is not verified.
     */

    handle = async ({ input }: Context<SignInPayload>) => {
        const { email, password } = input

        const user = await this.dbUser.findOne({
            where: { email },
        })

        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        const isPasswordValid = await compareHashedData(password, user.password)

        if (!isPasswordValid) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        if (user.role === "USER" && !user.isVerified) throw new ForbiddenError(AppMessages.FAILURE.VERIFY_ACCOUNT)

        const [generatedAccessToken, generatedRefreshToken] = await this.tokenService.getTokens({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        await this.dbUser.update({ refreshToken: generatedRefreshToken, refreshTokenExp: new Date() }, { where: { id: user.id } })

        logger.info("Logged In Successfully")

        const { password: dbPassword, refreshToken, refreshTokenExp, ...responsePayload } = user.dataValues
        
        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.LOGIN,
            data: responsePayload,
            headers: {
                "Set-Cookie": [
                    `accessToken=${generatedAccessToken}; Path=/; HttpOnly; maxAge=900000; SameSite=strict`,
                    `refreshToken=${generatedRefreshToken}; Path=/; HttpOnly; SameSite=strict`,
                ],
            },
        }
    }
}

export const signIn = new SignIn(Users, tokenService)
