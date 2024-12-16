import { DataTypes, type CreationOptional, type InferAttributes, type InferCreationAttributes, Model, type ForeignKey } from "sequelize"
import { sequelize } from "@/core"
import { Users } from "@/auth/model/user.model"
import { Program } from "@/programs/models/program.model"

export class AdminsAssignedPrograms extends Model<InferAttributes<AdminsAssignedPrograms>, InferCreationAttributes<AdminsAssignedPrograms>> {
    declare id: CreationOptional<string>
    declare userId: ForeignKey<Users["id"]>
    declare programId: ForeignKey<Program["id"]>
}

AdminsAssignedPrograms.init(
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
    },
    {
        modelName: "admins_assigned_programs",
        tableName: "admins_assigned_programs",
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
)

// AdminsAssignedPrograms.belongsTo(Users, { foreignKey: "userId" })
// AdminsAssignedPrograms.belongsTo(Program, { foreignKey: "programId" })
