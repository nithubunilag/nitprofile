;("use strict")

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("programs", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            startDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            isCompleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

            profileFrameSecureUrl: Sequelize.STRING,

            profileFramePublicId: Sequelize.STRING,

            profileFrameHeight: Sequelize.INTEGER,

            profileFrameWidth: Sequelize.INTEGER,

            profileGenerationAvailable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },

            certificateFrameSecureUrl: Sequelize.STRING,

            certificateFramePublicId: Sequelize.STRING,

            certificateFrameHeight: Sequelize.INTEGER,

            certificateFrameWidth: Sequelize.INTEGER,

            certificateGenerationAvailable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("programs")
    },
}
