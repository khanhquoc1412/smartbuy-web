'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductVariants', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            productId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            colorId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Colors',
                    key: 'id',
                },
                onDelete: "set null",
                onUpdate: "cascade",
            },
            memoryId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Memories',
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
        await queryInterface.dropTable('ProductVariants');
    }
};