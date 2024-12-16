import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from "sequelize"
import { sequelize } from "@/core"

export class NotificationEntity extends Model<InferAttributes<NotificationEntity>, InferCreationAttributes<NotificationEntity>> {
    declare id: CreationOptional<string>
    declare name: string
    declare description: CreationOptional<string>
    declare created_at?: CreationOptional<Date>
    declare updated_at?: CreationOptional<Date>
}

NotificationEntity.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        tableName: "notification_entity",
        modelName: "notification_entity",
    },
)
