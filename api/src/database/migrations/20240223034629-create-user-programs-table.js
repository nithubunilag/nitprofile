"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable("user_programs", {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            programId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "programs",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            profileImageUrl: Sequelize.STRING(500),

            profileGenerationDate: Sequelize.DATE,

            completedTraining: Sequelize.BOOLEAN,

            certificateImageUrl: Sequelize.STRING(500),

            certificateGenerationDate: Sequelize.DATE,

            acceptanceMailSent: Sequelize.BOOLEAN,

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

        await queryInterface.addIndex("user_programs", ["userId", "programId"], {
            unique: true,
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("user_programs")
    },
}
