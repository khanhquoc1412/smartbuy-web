
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {

        static associate(models) {

            this.hasMany(models.OrderDetail, {
                foreignKey: "orderId",
                as: "orderDetails",
            });

            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: 'user'
            });
            this.belongsTo(models.OrderStatus, {
                foreignKey: "orderStatusId",
                as: 'orderStatus'
            });
            this.belongsTo(models.Address, {
                foreignKey: "addressId",
                as: "address"
            })

            this.belongsTo(models.Payment, {
                foreignKey: "paymentId",
                as: "payment"
            })
        }
    }
    Order.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Order",
            timestamps: true,
        }
    );
    return Order;
};