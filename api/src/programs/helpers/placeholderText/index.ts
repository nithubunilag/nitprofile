import { Users } from "@/auth/model"
import { BadRequestError } from "@/core"
import { AppMessages } from "@/core/common"
import { Program } from "@/programs/models"

interface IOptions {
    programId: string
    userId: string
    entity: string
    entity_key?: string
}

class PlaceholderText {
    constructor(private readonly dbPrograms: typeof Program, private readonly dbUser: typeof Users) {}

    convert_entity_placeholder = async (options: IOptions) => {
        if (options.entity === "program") {
            return this._convert_program_entity_placeholder(options)
        }

        if (options.entity === "user") {
            return this._convert_user_entity_placeholder(options)
        }

        if (options.entity === "date") {
            return this._convert_date_entity_placeholder()
        }
    }

    private _convert_date_entity_placeholder = () => {
        return new Date().toLocaleDateString()
    }

    private _convert_user_entity_placeholder = async (options: IOptions) => {
        const { userId } = options

        const selectedUser = await this.dbUser.findOne({
            where: {
                id: userId,
            },
        })

        if (!selectedUser) throw new BadRequestError("Invalid User")

        const key = options?.entity_key ?? "firstName"

        const value = selectedUser[key as keyof Users] ?? "Invalid Property"

        console.log(value, value.toString())

        return value.toString()
    }

    private _convert_program_entity_placeholder = async (options: IOptions) => {
        const { programId } = options

        const selectedProgram = await this.dbPrograms.findOne({
            where: {
                id: programId,
            },
        })

        if (!selectedProgram) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const key = options?.entity_key ?? "name"

        const value = selectedProgram[key as keyof Program] ?? "Invalid Property"

        return value.toString()
    }
}

export const placeHolderTextConverter = new PlaceholderText(Program, Users)
