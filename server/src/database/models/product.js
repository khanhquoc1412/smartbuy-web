"use strict";
const { Model } = require("sequelize");
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {

        static associate(models) {
            this.belongsTo(models.Brand, {
                foreignKey: "brandId",
                as: "brand",
            });
            this.belongsTo(models.Category, {
                foreignKey: "categoryId",
                as: "category",
            });
            this.hasMany(models.ProductSpecification, {
                foreignKey: 'productId',
                as: 'productSpecs'
            });
            this.hasMany(models.ProductImage, {
                foreignKey: 'productId',
                as: 'images'
            });
            this.hasMany(models.ProductVariant, {
                foreignKey: 'productId',
                as: 'productVariants'
            })
        }
    }
    Product.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            thumbUrl: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            discountPercentage: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            basePrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Product",
            timestamps: true,
            hooks: {
                beforeValidate: function (product, options) {
                    product.slug = slugify(product.name, { lower: true });
                }
            }
        }
    );
    return Product;
};