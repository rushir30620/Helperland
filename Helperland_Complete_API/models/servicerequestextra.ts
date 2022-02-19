import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class ServiceRequestExtra extends Model{

    ServiceRequestExtraId!: number;
    // ServiceRequestId!: number; 
    ServiceExtraId!: number;
}

export const ServiceRequestExtraModelAttributes: ModelAttributes = {
    ServiceRequestExtraId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    // ServiceRequestId: {
    //   allowNull: false,
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model:'ServiceRequest',
    //     key: 'ServiceRequestId'
    //   },
    // },
    ServiceExtraId: {
        allowNull: false,
        type: DataTypes.INTEGER
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
//   class ServiceRequestExtra extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   ServiceRequestExtra.init({
//     ServiceRequestExtraId: DataTypes.INTEGER,
//     ServiceRequestId: DataTypes.INTEGER,
//     ServiceExtraId: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'ServiceRequestExtra',
//   });
//   return ServiceRequestExtra;
// };