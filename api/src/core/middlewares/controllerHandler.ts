import { HttpStatus, joiValidate, parseControllerArgs, ForbiddenError, UnAuthorizedError, UnProcessableError, logger } from "@/core"
import type { Response, Request, NextFunction } from "express"
import type { AnyFunction, ControllerHandlerOptions, ExpressCallbackFunction, IAuthRoles, ITokenSignedPayload, ValidationSchema } from "@/core"
import { authGuard } from "@/auth/helpers/authGuard"
import { AppMessages } from "../common"

interface IValidateRequestOptions {
    cookies: any
    user: ITokenSignedPayload | null | undefined
    options: ControllerHandlerOptions
    callbackFn: (user: ITokenSignedPayload) => void
}

export class ControllerHandler {
    handle = (controllerFn: AnyFunction, schema: ValidationSchema | undefined = {}, options?: ControllerHandlerOptions): ExpressCallbackFunction => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (options?.isPrivate) {
                    await this.validateRequest({
                        options,
                        user: req.user,
                        cookies: req.cookies,
                        callbackFn: (user) => {
                            req.user = user
                        },
                    })
                }

                const controllerArgs = parseControllerArgs.parse(req)
                const { input, params, query } = controllerArgs

                if (schema) {
                    const { querySchema, paramsSchema, inputSchema } = schema

                    try {
                        if (inputSchema) joiValidate(inputSchema, input)
                        if (querySchema) joiValidate(querySchema, query)
                        if (paramsSchema) joiValidate(paramsSchema, params)
                    } catch (error: any) {
                        throw new UnProcessableError(error.message.replaceAll('"', ""))
                    }
                }

                const controllerResult = await controllerFn(controllerArgs)

                if (!controllerResult) {
                    res.status(HttpStatus.OK).send({ status: true })

                    return
                }

                const { code, headers, ...data } = controllerResult

                res.set({ ...headers })
                    .status(code ?? HttpStatus.OK)
                    .send(data)
            } catch (error) {
                logger.error(`error ${error}`)

                next(error)
            }
        }
    }

    private async validateRequest(data: IValidateRequestOptions) {
        const { callbackFn, cookies, options, user } = data

        if (user && user.id && user?.role) return

        const isRequestAllowed = await authGuard.guard(cookies)

        if (!isRequestAllowed) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        if (options.allowedRoles && options.allowedRoles.length > 0) {
            const isRequestAuthorized = options.allowedRoles?.includes(isRequestAllowed.role.toLocaleUpperCase() as IAuthRoles)

            if (!isRequestAuthorized) throw new ForbiddenError("You do not have access to the requested resource")
        }

        callbackFn(isRequestAllowed)
    }
}
