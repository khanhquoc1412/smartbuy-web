"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {

        static associate(models) {
            // Product
            this.hasMany(models.Product, {
                foreignKey: "brandId",
                as: "products",
            });
        }
    }
    Brand.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            nameAscii: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            sequelize,
            modelName: "Brand",
            timestamps: true,
        }
    );
    return Brand;
};