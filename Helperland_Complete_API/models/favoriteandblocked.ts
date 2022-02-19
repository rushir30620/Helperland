import { Model, DataTypes, ModelAttributes } from 'sequelize';

export class FavoriteAndBlocked extends Model{

    Id!:number;
    UserId!:number;
    TargetUserId!:number;
    IsFavorite!: boolean;
    IsBlocked!: boolean;
}

export const FavoriteAndBlockedModelAttributes:ModelAttributes = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      TargetUserId: {
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        type: DataTypes.INTEGER
      },
      IsFavorite: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      IsBlocked: {
        allowNull: false,
        type: DataTypes.BOOLEAN
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
//   class FavoriteAndBlocked extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   FavoriteAndBlocked.init({
//     UserId: DataTypes.INTEGER,
//     TargetUserId: DataTypes.INTEGER,
//     IsFavorite: DataTypes.BOOLEAN,
//     IsBlocked: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'FavoriteAndBlocked',
//   });
//   return FavoriteAndBlocked;
// };