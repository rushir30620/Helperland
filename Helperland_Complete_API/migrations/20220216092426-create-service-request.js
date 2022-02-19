'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServiceRequest', {
      ServiceRequestId: {
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
      ServiceId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ServiceStartDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ServiceStartTime: {
        allowNull: false,
        type: Sequelize.TIME
      },
      ZipCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ServiceHourlyRate: {
        type: Sequelize.DECIMAL
      },
      ServiceHours: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      ExtraHours: {
        type: Sequelize.FLOAT
      },
      SubTotal: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      Discount: {
        type: Sequelize.DECIMAL
      },
      TotalCost: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      comments: {
        type: Sequelize.STRING
      },
      PaymentTransactionRefNo: {
        type: Sequelize.STRING
      },
      PaymentDue: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      ServiceProviderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'UserId'
        }
      },
      SPAcceptedDate: {
        type: Sequelize.DATE
      },
      HasPets: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      Status: {
        type: Sequelize.INTEGER
      },
      ModifiedBy: {
        type: Sequelize.INTEGER
      },
      RefundedAmount: {
        type: Sequelize.DECIMAL
      },
      Distance: {
        type: Sequelize.DECIMAL
      },
      HasIssue: {
        type: Sequelize.BOOLEAN
      },
      PaymentDone: {
        type: Sequelize.BOOLEAN
      },
      RecordVersion: {
        type: Sequelize.UUID
      },
      Comments: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('ServiceRequest');
  }
};