import { dispatch } from "@/app"
import { cache } from "@/app/app-cache"
import { create_user } from "@/auth/helpers/user"
import { Users } from "@/auth/model"
import { BadRequestError, ForbiddenError, HttpStatus, Joi, config, generateRandStr, logger, sequelize, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import type { ISendUsersEmail } from "@/programs/listeners"
import { Program, UserPrograms } from "@/programs/models"
import { type IProgramUser, type RegisterProgramUser } from "@/programs/payload_interfaces"
import csvToJson from "convert-csv-to-json"

interface IBaseUser {
    email: string
    firstName: string
    lastName: string
    programId: string
}

const csvSchema = Joi.object({
    email: Joi.string().required().trim(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
})

class RegisterProgramUsers {
    constructor(
        private readonly dbPrograms: typeof Program,
        private readonly dbUsers: typeof Users,
        private readonly dbUserPrograms: typeof UserPrograms,
    ) {}

    handle = async ({ input, query, files }: Context<RegisterProgramUser>) => {
        const program = await this.dbPrograms.findOne({
            where: { id: query.programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const usersToCreate: IProgramUser[] = []

        const dbTransaction = await sequelize.transaction()

        const createdUsers: Users[] = []

        const singleUser = Object.keys(input).length > 0

        try {
            if (singleUser) {
                usersToCreate.push(input.user)
            } else {
                if (!files || !files.csv || Array.isArray(files.csv)) throw new ForbiddenError("csv is required")

                const convertedJson = (await csvToJson.fieldDelimiter(",").getJsonFromCsv(files.csv.tempFilePath)) as IProgramUser[]

                const trimmedUsersToCreate = convertedJson.map((user) => {
                    const trimmedUser: IProgramUser = { ...user }
                    ;(Object.keys(user) as Array<keyof IProgramUser>).forEach((key) => {
                        trimmedUser[key] = typeof user[key] === "string" ? user[key].trim() : user[key]
                    })
                    return trimmedUser
                })

                usersToCreate.push(...trimmedUsersToCreate)
            }

            const sendMailPayload: ISendUsersEmail[] = []

            await Promise.all(
                usersToCreate.map(async (user) => {
                    let value = csvSchema.validate(user)

                    if (value.error) throw new BadRequestError(`Invalid User ${JSON.stringify(user)}`)

                    let existingUser = await this.dbUsers.findOne({
                        where: { email: user.email },
                    })

                    if (existingUser && existingUser.role !== "USER") {
                        throw new BadRequestError(`User with Email ${existingUser.email} already exists and is not a user`)
                    }

                    if (existingUser && existingUser.role === "USER") {
                        const userProgramExists = await this.dbUserPrograms.findOne({
                            where: { userId: existingUser.id, programId: program.id },
                        })

                        if (userProgramExists) throw new BadRequestError(`User with Email ${existingUser.email} already exists in this program`)
                    }

                    if (!existingUser) {
                        existingUser = await create_user._create_single_user(
                            {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                password: config.userDefaultPassword,
                                role: "USER",
                            },
                            dbTransaction,
                        )

                        logger.info(`User with ID ${existingUser.firstName} created successfully`)
                    }

                    createdUsers.push(existingUser)

                    await this.dbUserPrograms.create(
                        {
                            userId: existingUser.id,
                            programId: program.id,
                        },
                        { transaction: dbTransaction },
                    )

                    logger.info(`User with ID ${existingUser.firstName} added to Program with ID ${program.name} successfully`)

                    const inviteToken = generateRandStr(64)

                    await cache.set(inviteToken, user.email, "EX", 6000)

                    sendMailPayload.push({
                        programName: program.name,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: inviteToken,
                        email: user.email,
                        userId: existingUser.id,
                        programId: program.id,
                    })

                    logger.info(`User with Name ${user.firstName} Registered for program ${program.name} successfully`)
                }),
            )

            dispatch("event:sendNewUserMail", sendMailPayload)

            await dbTransaction.commit()
        } catch (error: any) {
            dbTransaction.rollback()

            logger.error(error?.message)

            throw new Error(error?.message ?? "Internal Server Error")
        }

        return {
            code: HttpStatus.CREATED,
            message: AppMessages.SUCCESS.USERS_REGISTERED_SUCCESSFULLY,
            data: singleUser ? createdUsers[0] : createdUsers,
        }
    }

    private _create_single_program_user = async (input: IBaseUser) => {
        const { email, firstName, lastName, programId } = input

        let existingUser = await this.dbUsers.findOne({
            where: { email },
        })

        if (existingUser) {
            const userProgramExists = await this.dbUserPrograms.findOne({
                where: { userId: existingUser.id, programId },
            })

            if (userProgramExists) throw new BadRequestError(`User with Email ${existingUser.email} already exists in this program`)
        }

        if (!existingUser) {
            existingUser = await create_user._create_single_user({
                email,
                firstName,
                lastName,
                password: config.userDefaultPassword,
                role: "USER",
            })

            logger.info(`User with ID ${existingUser.id} created successfully`)
        }

        await this.dbUserPrograms.create({
            userId: existingUser.id,
            programId: programId,
        })

        return existingUser
    }
}

export const registerProgramUsers = new RegisterProgramUsers(Program, Users, UserPrograms)
