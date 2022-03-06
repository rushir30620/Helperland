import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class Rating extends Model {
    RatingId!: number;
    ServiceRequestId!: number;
    RatingFrom!: number;
    RatingTo!: number;
    Ratings!: number;
    Comments!: string;
    RatingDate!: Date;
    IsApproved!: boolean;
    VisibleOnHomeScreen!: boolean;
    OnTimeArrival!: number;
    Friendly!: number;
    QualityOfService!: number;
}

export const RatingAttributes:ModelAttributes = {
    RatingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      ServiceRequestId: {
        allowNull: false,
        references: {
          model: 'ServiceRequest',
          key: 'ServiceRequestId'
        },
        type: DataTypes.INTEGER
      },
      RatingFrom: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      RatingTo: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      Ratings: {
        allowNull: false,
        type: DataTypes.DECIMAL(2,2)
      },
      Comments: {
        allowNull: true,
        type: DataTypes.STRING
      },
      RatingDate: {
        allowNull: true,
        type: DataTypes.DATE
      },
      IsApproved: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      VisibleOnHomeScreen: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      OnTimeArrival: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      Friendly: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      QualityOfService: {
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
// } = require('DataTypes');
// module.exports = (DataTypes, DataTypes) => {
//   class Rating extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of DataTypes lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Rating.init({
//     RatingId: DataTypes.NUMBER,
//     ServiceRequestId: DataTypes.NUMBER,
//     RatingFrom: DataTypes.NUMBER,
//     RatingTo: DataTypes.NUMBER,
//     Ratings: DataTypes.NUMBER,
//     Comments: DataTypes.STRING,
//     RatingDate: DataTypes.DATE,
//     IsApproved: DataTypes.BOOLEAN,
//     VisibleOnHomeScreen: DataTypes.BOOLEAN,
//     OnTimeArrival: DataTypes.NUMBER,
//     Friendly: DataTypes.NUMBER,
//     QualityOfService: DataTypes.NUMBER
//   }, {
//     DataTypes,
//     modelName: 'Rating',
//   });
//   return Rating;
// };