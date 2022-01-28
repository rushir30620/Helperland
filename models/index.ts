import { BuildOptions, Model, Sequelize } from 'sequelize';
import { ContactUS, ContactUSModelAttributes } from './contactus';

const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];

const sequelize = config.url 
    ? new Sequelize(config.url, config) 
    : new Sequelize(config.database, config.username, config.password, config);

export { Sequelize, sequelize };

type ContactUSModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ContactUS;
};

const ContactUSDefineModel = sequelize.define(
    'ContactUSs',
    {
        ...ContactUSModelAttributes
    },
    {
        tableName: 'ContactUSs'
    }
) as ContactUSModelStatic;

export interface DbContext {
    sequelize: Sequelize;
    ContactUSs: ContactUSModelStatic;
}

export const db: DbContext = {
    sequelize: sequelize,
    ContactUSs: ContactUSDefineModel
}

export { ContactUSDefineModel };





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
