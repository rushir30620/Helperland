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
exports.RatingAttributes = exports.Rating = void 0;
var sequelize_1 = require("sequelize");
var Rating = /** @class */ (function (_super) {
    __extends(Rating, _super);
    function Rating() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Rating;
}(sequelize_1.Model));
exports.Rating = Rating;
exports.RatingAttributes = {
    RatingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    ServiceRequestId: {
        allowNull: false,
        references: {
            model: 'ServiceRequest',
            key: 'ServiceRequestId'
        },
        type: sequelize_1.DataTypes.INTEGER
    },
    RatingFrom: {
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        },
        type: sequelize_1.DataTypes.INTEGER
    },
    RatingTo: {
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        },
        type: sequelize_1.DataTypes.INTEGER
    },
    Ratings: {
        allowNull: false,
        type: sequelize_1.DataTypes.DECIMAL(2, 2)
    },
    Comments: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING
    },
    RatingDate: {
        allowNull: true,
        type: sequelize_1.DataTypes.DATE
    },
    IsApproved: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    VisibleOnHomeScreen: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    OnTimeArrival: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER
    },
    Friendly: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER
    },
    QualityOfService: {
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
