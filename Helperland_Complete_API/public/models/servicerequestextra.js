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
exports.ServiceRequestExtraModelAttributes = exports.ServiceRequestExtra = void 0;
var sequelize_1 = require("sequelize");
var ServiceRequestExtra = /** @class */ (function (_super) {
    __extends(ServiceRequestExtra, _super);
    function ServiceRequestExtra() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServiceRequestExtra;
}(sequelize_1.Model));
exports.ServiceRequestExtra = ServiceRequestExtra;
exports.ServiceRequestExtraModelAttributes = {
    ServiceRequestExtraId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
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
        type: sequelize_1.DataTypes.INTEGER
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
