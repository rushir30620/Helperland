import { BuildOptions, Model, Sequelize } from 'sequelize';
import { ContactUS, ContactUSModelAttributes } from './contactus';
import { User, UserModelAttributes } from './user';
import { ServiceRequest, ServiceRequestModelAttributes } from './servicerequest';
import { ServiceRequestAddress, ServiceRequestAddressModelAttributes } from './servicerequestaddress';
import { ServiceRequestExtra, ServiceRequestExtraModelAttributes } from './servicerequestextra';
import { UserAddress, UserAddressModelAttributes } from './useraddress';
import { FavoriteAndBlocked, FavoriteAndBlockedModelAttributes } from './favoriteandblocked';
import { Rating, RatingAttributes } from './rating';

const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];

const sequelize = config.url 
    ? new Sequelize(config.url, config) 
    : new Sequelize(config.database, config.username, config.password, config);

export { Sequelize, sequelize };

// User model
type ContactUSModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ContactUS;
};

type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): User;
};

type ServiceRequestModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ServiceRequest;
};

type ServiceRequestAddressModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ServiceRequestAddress;
};

type UserAddressModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserAddress;
};

type ServiceRequestExtraModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ServiceRequestExtra;
};

type FavoriteAndBlockedModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): FavoriteAndBlocked;
};

type RatingModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): Rating;
};

const ContactUSDefineModel = sequelize.define(
    'ContactUs',
    {
        ...ContactUSModelAttributes
    },
    {
        tableName: 'ContactUs'
    }
) as ContactUSModelStatic;

const UserDefineModel = sequelize.define(
    'Users',
    {
        ...UserModelAttributes
    },
    {
        tableName: 'Users'
    }
) as UserModelStatic;

const ServiceRequestDefineModel = sequelize.define(
    'ServiceRequest',
    {
        ...ServiceRequestModelAttributes
    },
    {
        tableName: 'ServiceRequest'
    }
) as ServiceRequestModelStatic;

const ServiceRequestAddressDefineModel = sequelize.define(
    'ServiceRequestAddress',
    {
        ...ServiceRequestAddressModelAttributes
    },
    {
        tableName: 'ServiceRequestAddress'
    }
) as ServiceRequestAddressModelStatic;

const UserAddressDefineModel = sequelize.define(
    'UserAddress',
    {
        ...UserAddressModelAttributes
    },
    {
        tableName: 'UserAddress'
    }
) as UserAddressModelStatic;

const ServiceRequestExtraDefineModel = sequelize.define(
    'ServiceRequestExtra',
    {
        ...ServiceRequestExtraModelAttributes
    },
    {
        tableName: 'ServiceRequestExtra'
    }
) as ServiceRequestExtraModelStatic;

const FavoriteAndBlockedDefineModel = sequelize.define(
    'FavoriteAndBlocked',
    {
        ...FavoriteAndBlockedModelAttributes
    },
    {
        tableName: 'FavoriteAndBlocked'
    }
) as FavoriteAndBlockedModelStatic;

const RatingDefineModel = sequelize.define(
    'Rating',
    {
        ...RatingAttributes
    },
    {
        tableName: 'Rating'
    }
) as RatingModelStatic;

export interface DbContext {
    sequelize: Sequelize;
    ContactUS: ContactUSModelStatic;
    Users: UserModelStatic;
    ServiceRequest: ServiceRequestModelStatic;
    ServiceRequestAddress: ServiceRequestAddressModelStatic;
    UserAddress: UserAddressModelStatic;
    ServiceRequestExtra: ServiceRequestExtraModelStatic;
    FavoriteAndBlocked: FavoriteAndBlockedModelStatic;
    Rating: RatingModelStatic;
}

export const db: DbContext = {
    sequelize: sequelize,
    ContactUS: ContactUSDefineModel,
    Users: UserDefineModel,
    ServiceRequest: ServiceRequestDefineModel,
    ServiceRequestAddress: ServiceRequestAddressDefineModel,
    ServiceRequestExtra: ServiceRequestExtraDefineModel,
    UserAddress: UserAddressDefineModel,
    FavoriteAndBlocked: FavoriteAndBlockedDefineModel,
    Rating: RatingDefineModel
}

db.Users.hasMany(db.UserAddress, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    as: "UserAddress",
    constraints: true,
    onDelete: "CASCADE",
});
db.UserAddress.belongsTo(db.Users, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    as: "Users",
    constraints: true,
    onDelete: "CASCADE",
});

db.ServiceRequest.hasOne(db.ServiceRequestAddress, {
    foreignKey: {
        name: "ServiceRequestId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});
db.ServiceRequestAddress.belongsTo(db.ServiceRequest, {
    foreignKey: {
        name: "ServiceRequestId",
        allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});

db.Users.hasMany(db.ServiceRequest, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    as: "CustomerRequest",
    constraints: true,
    onDelete: "CASCADE",
});
db.ServiceRequest.belongsTo(db.Users, {
    foreignKey: {
        name: "UserId",
        allowNull: false,
    },
    as: "CustomerRequest",
    constraints: true,
    onDelete: "CASCADE",
});


db.Users.hasMany(db.ServiceRequest, {
    foreignKey: {
        name: "ServiceProviderId",
        allowNull: true,
    },
    as: "ServiceProviderRequest",
    constraints: true,
    onDelete: "CASCADE",
});
db.ServiceRequest.belongsTo(db.Users, {
    foreignKey: {
        name: "ServiceProviderId",
        allowNull: true,
    },
    as: "ServiceProviderRequest",
    constraints: true,
    onDelete: "CASCADE",
});

db.ServiceRequest.hasMany(db.ServiceRequestExtra,{
    foreignKey: {
      name: "ServiceRequestId",
      allowNull: true,
    },
    as: "ExtraService",
    constraints: true,
    onDelete: "CASCADE",
  });
  
db.Users.hasMany(db.FavoriteAndBlocked,{
    foreignKey: {
      name: "UserId",
      allowNull: false,
    },
    constraints: true,
    onDelete: "CASCADE",
});

db.Users.hasMany(db.Rating,{
    foreignKey: {
        name: "RatingFrom",
        allowNull: false
    },
    as: 'RatingFrom',
    constraints: true,
    onDelete: "CASCADE"
});

db.Users.hasMany(db.Rating,{
    foreignKey: {
        name: "RatingTo",
        allowNull: false
    },
    as: 'RatingTo',
    constraints: true,
    onDelete: "CASCADE"
});

db.ServiceRequest.hasOne(db.Rating,{
    foreignKey:{
        name: "ServiceRequestId",
        allowNull: false
    },
    as: 'SPRating',
    constraints: true,
    onDelete: "CASCADE"
});
db.Rating.belongsTo(db.ServiceRequest, {
    foreignKey: {
    name: "ServiceRequestId",
    allowNull: false,
  },
  as:'SPRating',
  constraints: true,
  onDelete: "CASCADE"
});

export default db;

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
