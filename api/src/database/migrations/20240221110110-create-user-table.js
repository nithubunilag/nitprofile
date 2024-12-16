"use strict"

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            otherName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            emailVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            profilePicPublicId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            resetToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            resetTokenExpiresIn: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            profilePicSecureUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            refreshToken: {
                type: Sequelize.STRING(600),
                allowNull: true,
            },
            refreshTokenExp: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            role: {
                type: Sequelize.ENUM("SUPER ADMIN", "ADMIN", "USER", "DEVELOPER"),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
        })

        await queryInterface.addIndex("users", ["email"], {
            unique: true,
        })

        await queryInterface.addIndex("users", ["id"], {
            unique: true,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("users")
    },
}
