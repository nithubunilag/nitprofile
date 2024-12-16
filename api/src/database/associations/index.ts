import { Users } from "@/auth/model"
import { AdminsAssignedPrograms, Program, UserPrograms } from "@/programs/models"

export const handleSetAssociations = () => {
    Users.hasMany(Program, { foreignKey: "createdBy", as: "program" })

    Program.belongsTo(Users, { foreignKey: "createdBy", as: "user" })

    Users.belongsToMany(Program, {
        through: UserPrograms,
    })

    Program.belongsToMany(Users, {
        through: UserPrograms,
        foreignKey: "programId",
        otherKey: "userId",
        as: "registeredUsers",
    })

    Program.belongsToMany(Users, {
        through: AdminsAssignedPrograms,
        foreignKey: "programId",
        otherKey: "userId",
        as: "assignedAdmins",
    })
}
