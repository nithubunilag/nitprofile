import { ControllerHandler } from "./controllerHandler"
import type { AnyFunction, ControllerHandlerOptions, IAuthRoles, ValidationSchema } from "../types"

export class ControlBuilder {
    private handler!: AnyFunction
    private schema: ValidationSchema | undefined
    private availableOptions = {
        isPrivate: false,
        isPrivateAndPublic: false,
    }

    private options: ControllerHandlerOptions | undefined = this.availableOptions

    static builder() {
        return new ControlBuilder()
    }

    setHandler(func: AnyFunction) {
        this.handler = func
        return this
    }

    setValidator(schema: ValidationSchema) {
        this.schema = schema
        return this
    }

    isPrivate() {
        this.options = { ...this.options, isPrivate: true }
        return this
    }

    only(...allowed: IAuthRoles[]) {
        this.options = { isPrivate: true, allowedRoles: allowed }
        return this
    }
    handle() {
        return new ControllerHandler().handle(this.handler, this.schema, this.options)
    }
}
