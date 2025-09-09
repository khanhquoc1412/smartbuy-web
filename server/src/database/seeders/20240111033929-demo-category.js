'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'mobile',
        nameAscii: 'mobile',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'laptop',
        nameAscii: 'laptop',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Đồng hồ',
        nameAscii: 'smartwatch',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
