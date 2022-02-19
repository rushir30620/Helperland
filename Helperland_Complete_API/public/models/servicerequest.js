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
exports.ServiceRequestModelAttributes = exports.ServiceRequest = void 0;
var sequelize_1 = require("sequelize");
var ServiceRequest = /** @class */ (function (_super) {
    __extends(ServiceRequest, _super);
    function ServiceRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ServiceRequest;
}(sequelize_1.Model));
exports.ServiceRequest = ServiceRequest;
exports.ServiceRequestModelAttributes = {
    ServiceRequestId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    ServiceId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER
    },
    ServiceStartDate: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE
    },
    ServiceStartTime: {
        allowNull: false,
        type: sequelize_1.DataTypes.TIME
    },
    ZipCode: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    ServiceHourlyRate: {
        type: sequelize_1.DataTypes.DECIMAL
    },
    ServiceHours: {
        allowNull: false,
        type: sequelize_1.DataTypes.FLOAT
    },
    ExtraHours: {
        type: sequelize_1.DataTypes.FLOAT
    },
    SubTotal: {
        allowNull: false,
        type: sequelize_1.DataTypes.DECIMAL
    },
    Discount: {
        type: sequelize_1.DataTypes.DECIMAL
    },
    TotalCost: {
        allowNull: false,
        type: sequelize_1.DataTypes.DECIMAL
    },
    Comments: {
        type: sequelize_1.DataTypes.STRING
    },
    PaymentTransactionRefNo: {
        type: sequelize_1.DataTypes.STRING
    },
    PaymentDue: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    // ServiceProviderId: {
    //   references: {
    //     model: 'User',
    //     key: 'id'
    // },
    //   type: DataTypes.INTEGER
    // },
    SPAcceptedDate: {
        type: sequelize_1.DataTypes.DATE
    },
    HasPets: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    Status: {
        type: sequelize_1.DataTypes.INTEGER
    },
    ModifiedBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
    RefundedAmount: {
        type: sequelize_1.DataTypes.DECIMAL
    },
    Distance: {
        type: sequelize_1.DataTypes.DECIMAL
    },
    HasIssue: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    PaymentDone: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    RecordVersion: {
        type: sequelize_1.DataTypes.UUID
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
