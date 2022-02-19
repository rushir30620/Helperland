'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAddress', {
      AddressId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'UserId'
        }
      },
      Addressline1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Addressline2: {
        type: Sequelize.STRING
      },
      City: {
        allowNull: false,
        type: Sequelize.STRING
      },
      State: {
        type: Sequelize.STRING
      },
      PostalCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      IsDefault: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      IsDeleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      Mobile: {
        type: Sequelize.BIGINT
      },
      Email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAddress');
  }
};