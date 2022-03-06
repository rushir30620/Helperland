"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.sequelize = exports.Sequelize = void 0;
var sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
var contactus_1 = require("./contactus");
var user_1 = require("./user");
var servicerequest_1 = require("./servicerequest");
var servicerequestaddress_1 = require("./servicerequestaddress");
var servicerequestextra_1 = require("./servicerequestextra");
var useraddress_1 = require("./useraddress");
var favoriteandblocked_1 = require("./favoriteandblocked");
var rating_1 = require("./rating");
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var sequelize = config.url
    ? new sequelize_1.Sequelize(config.url, config)
    : new sequelize_1.Sequelize(config.database, config.username, config.password, config);
exports.sequelize = sequelize;
var ContactUSDefineModel = sequelize.define('ContactUs', __assign({}, contactus_1.ContactUSModelAttributes), {
    tableName: 'ContactUs'
});
var UserDefineModel = sequelize.define('Users', __assign({}, user_1.UserModelAttributes), {
    tableName: 'Users'
});
var ServiceRequestDefineModel = sequelize.define('ServiceRequest', __assign({}, servicerequest_1.ServiceRequestModelAttributes), {
    tableName: 'ServiceRequest'
});
var ServiceRequestAddressDefineModel = sequelize.define('ServiceRequestAddress', __assign({}, servicerequestaddress_1.ServiceRequestAddressModelAttributes), {
    tableName: 'ServiceRequestAddress'
});
var UserAddressDefineModel = sequelize.define('UserAddress', __assign({}, useraddress_1.UserAddressModelAttributes), {
    tableName: 'UserAddress'
});
var ServiceRequestExtraDefineModel = sequelize.define('ServiceRequestExtra', __assign({}, servicerequestextra_1.ServiceRequestExtraModelAttributes), {
    tableName: 'ServiceRequestExtra'
});
var FavoriteAndBlockedDefineModel = sequelize.define('FavoriteAndBlocked', __assign({}, favoriteandblocked_1.FavoriteAndBlockedModelAttributes), {
    tableName: 'FavoriteAndBlocked'
});
var RatingDefineModel = sequelize.define('Rating', __assign({}, rating_1.RatingAttributes), {
    tableName: 'Rating'
});
exports.db = {
    sequelize: sequelize,
    ContactUS: ContactUSDefineModel,
    Users: UserDefineModel,
    ServiceRequest: ServiceRequestDefineModel,
    ServiceRequestAddress: ServiceRequestAddressDefineModel,
    ServiceRequestExtra: ServiceRequestExtraDefineModel,
    UserAddress: UserAddressDefineModel,
    FavoriteAndBlocked: FavoriteAndBlockedDefineModel,
    Rating: RatingDefineModel
};
exports.db.Users.hasMany(exports.db.UserAddress, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.UserAddress.belongsTo(exports.db.Users, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.ServiceRequest.hasOne(exports.db.ServiceRequestAddress, {
    foreignKey: {
        name: "ServiceRequestId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.ServiceRequestAddress.belongsTo(exports.db.ServiceRequest, {
    foreignKey: {
        name: "ServiceRequestId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.Users.hasMany(exports.db.ServiceRequest, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    as: "CustomerRequest",
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.ServiceRequest.belongsTo(exports.db.Users, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    as: "CustomerRequest",
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.Users.hasMany(exports.db.ServiceRequest, {
    foreignKey: {
        name: "ServiceProviderId",
        allowNull: true,
    },
    as: "ServiceProviderRequest",
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.ServiceRequest.belongsTo(exports.db.Users, {
    foreignKey: {
        name: "ServiceProviderId",
        allowNull: true,
    },
    as: "ServiceProviderRequest",
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.ServiceRequest.hasMany(exports.db.ServiceRequestExtra, {
    foreignKey: {
        name: "ServiceRequestId",
        allowNull: true,
    },
    as: "ExtraService",
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.Users.hasMany(exports.db.FavoriteAndBlocked, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});
exports.db.Users.hasMany(exports.db.Rating, {
    foreignKey: {
        name: "RatingFrom",
        allowNull: false
    },
    constraints: true,
    onDelete: "CASCADE"
});
exports.db.ServiceRequest.hasOne(exports.db.Rating, {
    foreignKey: {
        name: "ServiceRequestId",
        allowNull: false
    },
    constraints: true,
    onDelete: "CASCADE"
});
exports.default = exports.db;
// export { UserDefineModel };
// 'use strict';
// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.ts')[env];
// const db = {};
// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// module.exports = db;
