'use strict'
// @ts-check

const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class ModelOrders
 * @extends {Model}
 */
class ModelOrders extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelOrders}
   * @memberof ModelOrders
   */
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER(4).UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'id'
        },
        productId: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id'
          },
          field: 'product_id'
        },
        customerId: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: false,
          references: {
            model: 'customers',
            key: 'id'
          },
          field: 'customer_id'
        },
        currencyId: {
          type: DataTypes.INTEGER(4).UNSIGNED,
          allowNull: false,
          references: {
            model: 'currencies',
            key: 'id'
          },
          field: 'currency_id'
        },
        amount: {
          type: DataTypes.INTEGER(4),
          allowNull: false,
          defaultValue: '1',
          field: 'amount'
        },
        txPrice: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          field: 'tx_price'
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive', 'pending'),
          allowNull: false,
          defaultValue: 'pending',
          field: 'status'
        },
        createdId: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: true,
          field: 'created_id'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at'
        },
        updatedId: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: true,
          field: 'updated_id'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at'
        },
        deletedId: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: true,
          field: 'deleted_id'
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at'
        },
        logical: {
          type: new DataTypes.VIRTUAL(DataTypes.INTEGER(1), ['logical']),
          allowNull: true,
          field: 'logical',
          get() {
            return this.getDataValue('logical')
          },
          set(val) {}
        }
      },
      {
        modelName: 'orders',
        tableName: 'orders',
        underscored: false,
        paranoid: true,
        sequelize
      }
    )
  }

  /**
   * @example `this.belongsTo(models.your_models)` and also add into target model `this.hasMany(models.your_target_models)` or `this.hasOne(models.your_target_models)`
   * @static
   * @param {*} models
   * @memberof ModelOrders
   */
  static associate(models) {
    this.belongsTo(models.products)
    this.belongsTo(models.customers)
    this.belongsTo(models.currencies)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelOrders[]}
   * @memberof ModelOrders
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelOrders[]} */
      return await this.findAll(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {number} id
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelOrders}
   * @memberof ModelOrders
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelOrders} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelOrders
