import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class User extends Model {
    id!: number;

    firstName?: string;

    lastName?: string;

    email?: string;

    password?: string;

    mobile?: string;

    userTypeId?: number;

    gender?: string;

    dateOfBirth?: Date;

    isRegisteredUser?: boolean;

    worksWithPets?: boolean;

    zipCode?: string;

    languageId?: number;

    nationalityId?: number;

    resetKey?: string;

    createdAt!: Date;

    updatedAt!: Date;
};

export const UserModelAttributes: ModelAttributes = {
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        unique: true
    },
    mobile: {
        type: DataTypes.STRING,
        unique: true
    },
    userTypeId: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isRegisteredUser: {
        type: DataTypes.BOOLEAN,
        allowNull:false
    },
    worksWithPets: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    languageId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nationalityId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resetKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }

};






















// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init({
//     firstName: DataTypes.STRING,
//     lastName: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     mobile: DataTypes.INTEGER,
//     userTypeId: DataTypes.INTEGER,
//     gender: DataTypes.STRING,
//     dateOfBirth: DataTypes.DATE,
//     isRegisteredUser: DataTypes.BOOLEAN,
//     worksWithPets: DataTypes.BOOLEAN,
//     zipCode: DataTypes.INTEGER,
//     languageId: DataTypes.INTEGER,
//     nationalityId: DataTypes.INTEGER,
//     resetKey: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };