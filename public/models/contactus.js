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
exports.ContactUSModelAttributes = exports.ContactUS = void 0;
var sequelize_1 = require("sequelize");
var ContactUS = /** @class */ (function (_super) {
    __extends(ContactUS, _super);
    function ContactUS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ContactUS;
}(sequelize_1.Model));
exports.ContactUS = ContactUS;
;
exports.ContactUSModelAttributes = {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    subjectType: {
        type: sequelize_1.DataTypes.STRING
    },
    subject: {
        type: sequelize_1.DataTypes.STRING
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.INTEGER
    },
    uploadFileName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
};
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
