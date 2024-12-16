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

        await queryInterface.createTable('program_nodes', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            programId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'programs',
                    key: 'id',
                },
            },
            type: {
                type: Sequelize.ENUM('image', 'text'),
                allowNull: false,
            },
            x: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            y: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            overlay: {
                type: Sequelize.STRING,
            },
            width: {
                type: Sequelize.INTEGER,
            },
            height: {
                type: Sequelize.INTEGER,
            },
            gravity: {
                type: Sequelize.STRING,
            },
            radius: {
                type: Sequelize.INTEGER,
            },
            crop: {
                type: Sequelize.STRING,
            },
            text: {
                type: Sequelize.STRING,
            },
            font_family: {
                type: Sequelize.STRING,
            },
            font_size: {
                type: Sequelize.INTEGER,
            },
            font_weight: {
                type: Sequelize.STRING,
            },
            color: {
                type: Sequelize.STRING,
            },
            placeholder: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            entity: {
                type: Sequelize.ENUM('program', 'date', 'user'),
            },
            entity_key: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        await queryInterface.addIndex('program_nodes', ['programId']);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("program_nodes")
    },
}
