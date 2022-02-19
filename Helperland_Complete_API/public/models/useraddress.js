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
exports.UserAddressModelAttributes = exports.UserAddress = void 0;
var sequelize_1 = require("sequelize");
var UserAddress = /** @class */ (function (_super) {
    __extends(UserAddress, _super);
    function UserAddress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UserAddress;
}(sequelize_1.Model));
exports.UserAddress = UserAddress;
exports.UserAddressModelAttributes = {
    AddressId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
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
        type: sequelize_1.DataTypes.STRING
    },
    Addressline2: {
        type: sequelize_1.DataTypes.STRING
    },
    City: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    State: {
        type: sequelize_1.DataTypes.STRING
    },
    PostalCode: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    IsDefault: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    IsDeleted: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    Mobile: {
        type: sequelize_1.DataTypes.STRING
    },
    Email: {
        type: sequelize_1.DataTypes.STRING
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
