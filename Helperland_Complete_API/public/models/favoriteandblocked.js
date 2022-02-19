"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteAndBlockedModelAttributes = exports.FavoriteAndBlocked = void 0;
var sequelize_1 = require("sequelize");
var FavoriteAndBlocked = /** @class */ (function (_super) {
    __extends(FavoriteAndBlocked, _super);
    function FavoriteAndBlocked() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FavoriteAndBlocked;
}(sequelize_1.Model));
exports.FavoriteAndBlocked = FavoriteAndBlocked;
exports.FavoriteAndBlockedModelAttributes = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    UserId: {
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        },
        type: sequelize_1.DataTypes.INTEGER
    },
    TargetUserId: {
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        },
        type: sequelize_1.DataTypes.INTEGER
    },
    IsFavorite: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    IsBlocked: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE
    }
};
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
