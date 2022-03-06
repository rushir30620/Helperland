import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class ServiceRequestAddress extends Model{

    id!:number;
    ServiceRequestId!: number;
    Addressline1!: string;
    Addressline2!: string;
    City!: string;
    State!: string;
    PostalCode!: string;
    Mobile!: string;
    Email!: string;
    // ServiceRequestId: any;
}

export const ServiceRequestAddressModelAttributes:ModelAttributes = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      // ServiceRequestId: {
      //   references: {
      //     model:'ServiceRequest',
            
      //     key: 'ServiceRequestId'
      //   },
      //   type: DataTypes.INTEGER
      // },
      Addressline1: {
        type: DataTypes.STRING
      },
      Addressline2: {
        type: DataTypes.STRING
      },
      City: {
        type: DataTypes.STRING
      },
      State: {
        type: DataTypes.STRING
      },
      PostalCode: {
        type: DataTypes.STRING
      },
      Mobile: {
        type: DataTypes.INTEGER
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
//   class ServiceRequestAddress extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   ServiceRequestAddress.init({
//     ServiceRequestId: DataTypes.INTEGER,
//     Addressline1: DataTypes.STRING,
//     Addressline2: DataTypes.STRING,
//     City: DataTypes.STRING,
//     State: DataTypes.STRING,
//     PostalCode: DataTypes.STRING,
//     Mobile: DataTypes.STRING,
//     Email: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'ServiceRequestAddress',
//   });
//   return ServiceRequestAddress;
// };