import { DataTypes, type CreationOptional, type InferAttributes, type InferCreationAttributes, Model, UUIDV4, type ForeignKey } from "sequelize"
import { sequelize } from "@/core"
import { Permissions } from "./permissions.model"
import { Users } from "./user.model"

export class UserPermissions extends Model<InferAttributes<UserPermissions>, InferCreationAttributes<UserPermissions>> {
    declare id: CreationOptional<string>
    declare permissionId: ForeignKey<Permissions["id"]>
    declare userId: ForeignKey<Users["id"]>
}

UserPermissions.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        permissionId: {
            type: DataTypes.UUID,
            allowNull: true,

            references: {
                model: Permissions,
                key: "id",
            },
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: true,

            references: {
                model: Users,
                key: "id",
            },
        },
    },
    {
        modelName: "user_permissions",
        tableName: "user_permissions",
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
)
