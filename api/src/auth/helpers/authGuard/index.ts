import { config, type ITokenSignedPayload } from "@/core"
import { tokenService, type TokenService } from "../token"

class AuthGuard {
    constructor(private readonly tokenService: TokenService) {}

    public guard = async (cookies: any): Promise<false | ITokenSignedPayload> => {
        const cookieAccessToken = cookies?.accessToken

        if (!cookieAccessToken) return false

        const { accessTokenSecret } = config.auth

        const user = await this.tokenService.extractTokenDetails(cookieAccessToken, accessTokenSecret)

        if (!user) return false

        return user as ITokenSignedPayload
    }
}

export const authGuard = new AuthGuard(tokenService)
