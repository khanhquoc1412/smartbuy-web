'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Memories', [
      {
        ram: '8GB',
        rom: '256GB',
        chipset: 'Apple A17 Pro',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ram: '4GB',
        rom: '64GB',
        chipset: 'Snapdragon 7 Gen 1 8 nhân',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ram: '8GB',
        rom: '128GB',
        chipset: 'Exynos 1280',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Memories', null, {});
  }
};
