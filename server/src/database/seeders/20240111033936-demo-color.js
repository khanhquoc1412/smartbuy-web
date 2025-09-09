'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Colors', [
      {
        name: 'Đỏ',
        code: '#FC240E',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vàng',
        code: '#EFDF22',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Đen',
        code: '#000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Colors', null, {});
  }
};
