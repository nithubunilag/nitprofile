import jwt, { type JwtPayload } from "jsonwebtoken"

import { AppMessages } from "@/core/common"
import { UnAuthorizedError, config, logger, type ITokenSignedPayload } from "@/core"
import { encryptor, Encryptor } from "../encryptor"

export class TokenService {
    constructor(private readonly encryptor: Encryptor) {}

    async getTokens(data: ITokenSignedPayload): Promise<string[]> {
        return await Promise.all([this._generateAccessToken(data), this._generateRefreshToken(data)])
    }

    async extractTokenDetails(encryptedToken: string, secret: string) {
        const decryptedToken = this.encryptor.decrypt(encryptedToken)

        // verify the token
        const tokenDetails = this._verifyToken(decryptedToken, secret)

        // extract the token information
        let tokenPayload = tokenDetails as ITokenSignedPayload

        return tokenPayload
    }

    _verifyToken(token: string, secret: string): JwtPayload {
        try {
            jwt.verify(token, secret) as JwtPayload

            return jwt.decode(token) as jwt.JwtPayload
        } catch (err) {
            logger.error(err)
            throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)
        }
    }

    private _generateAccessToken(data: ITokenSignedPayload): string {
        const { accessTokenExpiresIn, accessTokenSecret } = config.auth

        const accessToken = this._generateToken({
            data,
            secret: accessTokenSecret,
            expiresIn: accessTokenExpiresIn,
        })

        return this.encryptor.encrypt(accessToken)
    }

    private _generateRefreshToken(data: ITokenSignedPayload): string {
        const { refreshTokenExpiresIn, refreshTokenSecret } = config.auth

        const refreshToken = this._generateToken({
            data,
            secret: refreshTokenSecret,
            expiresIn: refreshTokenExpiresIn,
        })

        return this.encryptor.encrypt(refreshToken)
    }

    private _generateToken({ data, secret, expiresIn }: { data: ITokenSignedPayload; expiresIn: string; secret: string }): string {
        return jwt.sign(data, secret, {
            expiresIn,
            jwtid: crypto.randomUUID(),
        })
    }
}

export const tokenService = new TokenService(encryptor)
