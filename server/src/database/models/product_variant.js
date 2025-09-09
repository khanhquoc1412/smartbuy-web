"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductVariant extends Model {

        static associate(models) {
            // Product
            this.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "product",
            });
            this.belongsTo(models.Memory, {
                foreignKey: "memoryId",
                as: "memory",
            });
            this.belongsTo(models.Color, {
                foreignKey: "colorId",
                as: "color",
            });
            this.hasMany(models.Cart,{
                foreignKey: 'productVariantId',
                as: "carts"
            })
        }
    }
    ProductVariant.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0

            }
        },
        {
            sequelize,
            modelName: "ProductVariant",
            timestamps: true,
        }
    );
    return ProductVariant;
};