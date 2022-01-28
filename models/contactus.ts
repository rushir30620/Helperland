import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class ContactUS extends Model {
    id!: number;

    name?: string;

    email?: string;

    subjectType?: string;

    subject?: string;

    phoneNumber?: number;

    uploadFileName?: string;

    path?: string;

    createdAt!: Date;

    updatedAt!: Date;
};

export const ContactUSModelAttributes: ModelAttributes = {
    id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    subjectType: {
        type: DataTypes.STRING
    },
    subject: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.INTEGER
    },
    uploadFileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    path: {
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

}







// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class ContactUs extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   ContactUs.init({
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     subjectType: DataTypes.STRING,
//     subject: DataTypes.STRING,
//     phoneNumber: DataTypes.INTEGER,
//     message: DataTypes.STRING,
//     uploadFileName: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'ContactUs',
//   });
//   return ContactUs;
// };