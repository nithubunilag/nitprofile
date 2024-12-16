import { CookieHandler } from "./cookieHandler"
import { ErrorHandler } from "./errorhandler"
import { NotFoundErrorHandler } from "./notFoundErrorHandler"


export const errorHandler = new ErrorHandler()
export const notFoundHandler = new NotFoundErrorHandler()
export const cookieHandler = new CookieHandler()

