'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../../utils');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Cart, {
        foreignKey: 'userId',
        as: 'carts'
      })
    }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userName: {
      type: DataTypes.STRING,
      defaultValue: "username",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      min: 6,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    verifiedDate: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    verificationToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    passwordToken: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    passwordTokenExpire: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await hashPassword(user.password);
      },
    },
    sequelize,
    timestamps: true,
    modelName: 'User',
  });
  return User;
};