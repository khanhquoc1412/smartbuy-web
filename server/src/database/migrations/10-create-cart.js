'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1
            },
            productVariantId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'ProductVariants',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: "set null",
                onUpdate: "cascade",
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Carts');
    }
};