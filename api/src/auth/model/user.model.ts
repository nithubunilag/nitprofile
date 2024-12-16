import { sequelize, type IAuthRoles } from "@/core"
import { Program } from "@/programs/models"
import {
    DataTypes,
    Model,
    UUIDV4,
    type BelongsToManyGetAssociationsMixin,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
    type NonAttribute,
} from "sequelize"

export const auth_roles = ["SUPER ADMIN", "ADMIN", "USER", "DEVELOPER"] as const

export class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
    // BelongsToMany(()=>Program, {
    //     through: UserPrograms,
    //     foreignKey: "userId",
    //     otherKey: "programId",
    //     as: "program_user",
    // })

    // new BelongsToMany(() => Program, {
    //     through: 'LikedToot',
    //   })

    declare id: CreationOptional<string>
    declare firstName: string
    declare otherName: CreationOptional<string | null>
    declare lastName: string
    declare password: CreationOptional<string>
    declare email: string
    declare emailVerified: CreationOptional<boolean>
    declare profilePicPublicId: CreationOptional<string | null>
    declare profilePicSecureUrl: CreationOptional<string | null>
    declare resetToken: CreationOptional<string | null>
    declare resetTokenExpiresIn: CreationOptional<Date | null>
    declare refreshToken: CreationOptional<string>
    declare refreshTokenExp: CreationOptional<Date>
    declare isVerified: CreationOptional<boolean>
    declare role: IAuthRoles
    declare programs?: NonAttribute<Program[]>
    declare getPrograms: BelongsToManyGetAssociationsMixin<Program>
}

Users.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otherName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        profilePicPublicId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetTokenExpiresIn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        profilePicSecureUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.STRING(600),
            allowNull: true,
        },
        refreshTokenExp: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        role: {
            type: DataTypes.ENUM(...auth_roles),
            allowNull: false,
        },
    },

    {
        scopes: {
            withPassword: {
                attributes: {
                    include: ["password"],
                },
            },
            withRefreshToken: {
                attributes: {
                    include: ["refreshToken", "refreshTokenExp"],
                },
            },
        },
        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
            {
                unique: true,
                fields: ["id"],
            },
        ],
        modelName: "users",
        tableName: "users",
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
)
