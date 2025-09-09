'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Specifications', [
      {
        specName: 'Màn hình',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'Hệ điều hành',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'Camera sau',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'Camera trước',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'Chip',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'RAM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'Dung lượng lưu trữ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'SIM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        specName: 'Pin, Sạc',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Specifications', null, {});
  }
};
