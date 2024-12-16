import { DataTypes, type CreationOptional, type InferAttributes, type InferCreationAttributes, Model, UUIDV4 } from "sequelize"
import { sequelize } from "@/core"
import { type IPermissionAbility, permission_abilities } from "../helpers/permissions/types"

export class Permissions extends Model<InferAttributes<Permissions>, InferCreationAttributes<Permissions>> {
    declare id: CreationOptional<string>
    declare resource: string
    declare ability: IPermissionAbility[]
}

Permissions.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        ability: {
            type: DataTypes.ARRAY(DataTypes.ENUM(...permission_abilities)),
            allowNull: false,
        },
    },
    {
        modelName: "permissions",
        tableName: "permissions",
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
)
