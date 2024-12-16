"use strict"

const bcrypt = require("bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const password = "Damilola&12"
        const hashedPassword = await bcrypt.hash(password, 12)

        await queryInterface.bulkInsert(
            "users",
            [
                {
                    id: "622c4d4e-3786-4c19-b790-29e4c8c67463",
                    firstName: "Odumuyiwa",
                    lastName: "Victor",
                    otherName: "",
                    password: hashedPassword,
                    email: "davidokunoye003@gmail.com",
                    emailVerified: true,
                    profilePicPublicId: null,
                    resetToken: null,
                    resetTokenExpiresIn:null,
                    profilePicSecureUrl: null,
                    refreshToken: null,
                    refreshTokenExp: null,
                    isVerified: true,
                    role: "SUPER ADMIN",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("users", null)
    },
}
