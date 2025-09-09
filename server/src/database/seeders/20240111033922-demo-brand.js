'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      {
        name: 'apple',
        nameAscii: 'apple',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'samsung',
        nameAscii: 'samsung',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'dell',
        nameAscii: 'dell',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};
