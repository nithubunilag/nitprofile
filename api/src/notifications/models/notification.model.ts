import { type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model } from "sequelize"
import { sequelize } from "@/core"
import { Users } from "@/auth/model/user.model"
import { NotificationEntity } from "./notification_entity.model"

export class Notifications extends Model<InferAttributes<Notifications>, InferCreationAttributes<Notifications>> {
    declare id: CreationOptional<string>
    declare read: CreationOptional<boolean>
    declare message: string
    declare actor: CreationOptional<ForeignKey<string>>
    declare notifier: ForeignKey<string>
    declare item_id: string
    declare entity_type_id: ForeignKey<string>
    declare created_at?: CreationOptional<Date>
    declare updated_at?: CreationOptional<Date>
}

Notifications.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        actor: {
            type: DataTypes.UUID,
            allowNull: true,

            references: {
                model: Users,
                key: "id",
            },
        },
        notifier: {
            type: DataTypes.UUID,
            allowNull: false,

            references: {
                model: Users,
                key: "id",
            },
        },
        entity_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: NotificationEntity,
                key: "id",
            },
        },
    },
    {
        sequelize,
        freezeTableName: true,
        tableName: "notifications",
        modelName: "notifications",
        timestamps: true,
    },
)
