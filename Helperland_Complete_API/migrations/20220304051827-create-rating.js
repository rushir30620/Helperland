'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rating', {
      RatingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ServiceRequestId: {
        allowNull: false,
        references: {
          model: 'ServiceRequest',
          key: 'ServiceRequestId',
          as: 'ServiceRequestId'
        },
        type: Sequelize.INTEGER
      },
      RatingFrom: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'RatingFrom'
        },
        type: Sequelize.INTEGER
      },
      RatingTo: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'RatingTo'
        },
        type: Sequelize.INTEGER
      },
      Ratings: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      Comments: {
        allowNull: true,
        type: Sequelize.STRING
      },
      RatingDate: {
        allowNull: true,
        type: Sequelize.DATE
      },
      IsApproved: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      VisibleOnHomeScreen: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      OnTimeArrival: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Friendly: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      QualityOfService: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Rating');
  }
};