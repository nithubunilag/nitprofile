import type { ICreateUser } from "@/auth/interfaces"
import { Users } from "@/auth/model/user.model"
import { BadRequestError, hashData, logger, sequelize } from "@/core"
import { AppMessages } from "@/core/common"
import { Transaction } from "sequelize"

class CreateUser {
    constructor(private readonly dbUser: typeof Users) {}

    /**
     * Creates a single user in the database.
     * @param {ICreateUser} input - The user data to create.
     * @returns {Promise<Users>} - The created user.
     * @throws {BadRequestError} - If the provided email already exists in the database.
     */
    public _create_single_user = async (input: ICreateUser, transaction?: Transaction) => {
        const { email, password } = input

        const userExists = await this.dbUser.findOne({
            where: { email },
        })

        if (userExists) throw new BadRequestError(AppMessages.FAILURE.EMAIL_EXISTS)

        // Hash the Password
        const hashPassword = await hashData(password)

        // Create the User
        const newUser = await this.dbUser.create({ ...input, password: hashPassword }, { transaction })

        logger.info(`User with ID ${newUser.id} created successfully`)

        return newUser
    }

    /**
     * Creates multiple users in the database in a bulk transaction.
     * @param {ICreateUser[]} users - The array of user data to create.
     * @returns {Promise<Users[]>} - The array of created users.
     * @throws {Error} - If an error occurs during the creation process.
     */
    public _create_users_bulk = async (users: ICreateUser[]) => {
        const dbTransaction = await sequelize.transaction()

        const createdUsers: Users[] = []

        try {
            await Promise.all(
                users.map(async (user) => {
                    const createdUser = await this._create_single_user(user)

                    createdUsers.push(createdUser)
                }),
            )

            logger.info(`Users created successfully`)

            dbTransaction.commit()

            return createdUsers
        } catch (error: any) {
            dbTransaction.rollback()

            logger.error(error?.message)

            throw new Error("Error while creating Users")
        }
    }
}

export const create_user = new CreateUser(Users)
