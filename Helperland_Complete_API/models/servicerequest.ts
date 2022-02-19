import { Model, DataTypes, ModelAttributes, DecimalDataType } from 'sequelize';

export class ServiceRequest extends Model{

    ServiceRequestId!:number;
    UserId!: number;
    ServiceId!: number;
    ServiceStartDat!:Date;
    ServiceStartTime!:number;
    ZipCode!:string;
    ServiceHourlyRate!: number;
    ServiceHours!:number;
    ExtraHours!:number;
    SubTotal!: number;
    Discount!: number;
    TotalCost!: number;
    Comments!: string;
    PaymentTransactionRefNo!: string;
    PaymentDue!: boolean ;
    ServiceProviderId!: number;
    SPAcceptedDat!: Date;
    HasPets!: boolean;
    Status!: number;
    ModifiedBy!: number;
    RefundedAmount!: number;
    Distance!: number;
    HasIssue!: boolean;
    PaymentDone!: boolean;
    RecordVersion!:number ;
}

export const ServiceRequestModelAttributes:ModelAttributes = {
    ServiceRequestId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      ServiceId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      ServiceStartDate: {
        allowNull: false,
        type: DataTypes.DATE
      },
      ServiceStartTime: {
        allowNull: false,
        type: DataTypes.TIME
      },
      ZipCode: {
        allowNull: false,
        type: DataTypes.STRING
      },
      ServiceHourlyRate: {
        type: DataTypes.DECIMAL
      },
      ServiceHours: {
        allowNull: false,
        type: DataTypes.FLOAT
      },
      ExtraHours: {
        type: DataTypes.FLOAT
      },
      SubTotal: {
        allowNull: false,
        type: DataTypes.DECIMAL
      },
      Discount: {
        type: DataTypes.DECIMAL
      },
      TotalCost: {
        allowNull: false,
        type: DataTypes.DECIMAL
      },
      Comments: {
        type: DataTypes.STRING
      },
      PaymentTransactionRefNo: {
        type: DataTypes.STRING
      },
      PaymentDue: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      // ServiceProviderId: {
      //   references: {
      //     model: 'User',
      //     key: 'id'
      // },
      //   type: DataTypes.INTEGER
      // },
      SPAcceptedDate: {
        type: DataTypes.DATE
      },
      HasPets: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      Status: {
        type: DataTypes.INTEGER
      },
      ModifiedBy: {
        type: DataTypes.INTEGER
      },
      RefundedAmount: {
        type: DataTypes.DECIMAL
      },
      Distance: {
        type: DataTypes.DECIMAL
      },
      HasIssue: {
        type: DataTypes.BOOLEAN
      },
      PaymentDone: {
        type: DataTypes.BOOLEAN
      },
      RecordVersion: {
        type: DataTypes.UUID
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
//   class ServiceRequest extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   ServiceRequest.init({
//     ServiceRequestId: DataTypes.INTEGER,
//     UserId: DataTypes.INTEGER,
//     ServiceId: DataTypes.INTEGER,
//     ServiceStartDate: DataTypes.DATE,
//     ServiceStartTime: DataTypes.TIME,
//     ZipCode: DataTypes.STRING,
//     ServiceHourlyRate: DataTypes.DECIMAL,
//     ServiceHours: DataTypes.FLOAT,
//     ServiceHours: DataTypes.FLOAT,
//     ExtraHours: DataTypes.FLOAT,
//     SubTotal: DataTypes.DECIMAL,
//     Discount: DataTypes.DECIMAL,
//     TotalCost: DataTypes.DECIMAL,
//     comments: DataTypes.STRING,
//     PaymentTransactionRefNo: DataTypes.STRING,
//     PaymentDue: DataTypes.BOOLEAN,
//     ServiceProviderId: DataTypes.INTEGER,
//     SPAcceptedDate: DataTypes.DATE,
//     HasPets: DataTypes.BOOLEAN,
//     Status: DataTypes.INTEGER,
//     ModifiedBy: DataTypes.INTEGER,
//     RefundedAmount: DataTypes.DECIMAL,
//     Distance: DataTypes.DECIMAL,
//     HasIssue: DataTypes.BOOLEAN,
//     PaymentDone: DataTypes.BOOLEAN,
//     RecordVersion: DataTypes.UUID
//   }, {
//     sequelize,
//     modelName: 'ServiceRequest',
//   });
//   return ServiceRequest;
// };