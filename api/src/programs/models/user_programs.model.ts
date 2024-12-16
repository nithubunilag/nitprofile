import { Users } from "@/auth/model/user.model"
import { sequelize } from "@/core"
import { Program } from "@/programs/models/program.model"
import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize"

export class UserPrograms extends Model<InferAttributes<UserPrograms>, InferCreationAttributes<UserPrograms>> {
    declare id: CreationOptional<string>
    declare userId: ForeignKey<Users["id"]>
    declare programId: ForeignKey<Program["id"]>
    declare profileImageUrl: CreationOptional<string>
    declare profileGenerationDate: CreationOptional<Date>
    declare completedTraining: CreationOptional<boolean>
    declare certificateImageUrl: CreationOptional<string>
    declare certificateGenerationDate: CreationOptional<Date>
    declare acceptanceMailSent: CreationOptional<boolean>
}

UserPrograms.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: Users,
                key: "id",
            },
        },
        programId: {
            type: DataTypes.UUID,
            references: {
                model: Program,
                key: "id",
            },
        },

        completedTraining: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        profileImageUrl: {
            type: DataTypes.STRING(500),
        },
        profileGenerationDate: {
            type: DataTypes.DATE,
        },
        certificateImageUrl: {
            type: DataTypes.STRING(500),
        },
        certificateGenerationDate: {
            type: DataTypes.DATE,
        },
        acceptanceMailSent: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["userId", "programId"],
            },
        ],
        modelName: "user_programs",
        tableName: "user_programs",
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
)
