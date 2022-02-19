import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class UserAddress extends Model {

  AddressId!: number;

  // UserId!: number;

  Addressline1!: string;

  Addressline2!: string;

  City!: string;

  State!: string;

  PostalCode!: string;

  IsDefault!: boolean;

  IsDeleted!: boolean;

  Email!: string;

  Mobile!: string;
}

export const UserAddressModelAttributes: ModelAttributes = {
  AddressId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  // UserId: {
  //   allowNull: false,
  //   references: {
  //     model: 'User',
  //     key: 'id'
  //   },
  //   type: DataTypes.INTEGER
  // },
  Addressline1: {
    allowNull: false,
    type: DataTypes.STRING
  },
  Addressline2: {
    type: DataTypes.STRING
  },
  City: {
    allowNull: false,
    type: DataTypes.STRING
  },
  State: {
    type: DataTypes.STRING
  },
  PostalCode: {
    allowNull: false,
    type: DataTypes.STRING
  },
  IsDefault: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  IsDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  Mobile: {
    type: DataTypes.STRING
  },
  Email: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}















// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class UserAddress extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   UserAddress.init({
//     AddressId: DataTypes.INTEGER,
//     UserId: DataTypes.INTEGER,
//     Addressline1: DataTypes.STRING,
//     Addressline2: DataTypes.STRING,
//     City: DataTypes.STRING,
//     State: DataTypes.STRING,
//     PostalCode: DataTypes.STRING,
//     IsDefault: DataTypes.BOOLEAN,
//     IsDeleted: DataTypes.BOOLEAN,
//     Mobile: DataTypes.INTEGER,
//     Email: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'UserAddress',
//   });
//   return UserAddress;
// };