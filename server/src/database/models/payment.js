"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {

        static associate(models) {
            this.hasMany(models.Order, {
                foreignKey: "paymentId",
                as: "orders",
            });
            this.belongsTo(models.PaymentStatus, {
                foreignKey: "paymentStatusId",
                as: "paymentStatus"
            });
            this.belongsTo(models.PaymentMethod, {
                foreignKey: "paymentMethodId",
                as: "paymentMethod"
            })
        }
    }
    Payment.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
        },
        {
            sequelize,
            modelName: "Payment",
            timestamps: true,
        }
    );
    return Payment;
};