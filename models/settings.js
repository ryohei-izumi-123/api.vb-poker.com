'use strict'
// @ts-check

const _ = require('lodash')
const BigNumber = require('bignumber.js')
const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class ModelSettings
 * @extends {Model}
 */
class ModelSettings extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelSettings}
   * @memberof ModelSettings
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
        fee: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          defaultValue: '0.0000',
          field: 'fee',
          validate: {
            isDecimal: true
          },
          get() {
            const val = this.getDataValue('fee')
            const precision = 4
            return Number(new BigNumber(val).times(100).toFixed(precision))
          },
          set(val) {
            const precision = 4
            this.setDataValue('fee', Number(new BigNumber(val).dividedBy(100).toFixed(precision)))
          }
        },
        name: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: 'DEFAULT',
          field: 'name'
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
        address: {
          type: DataTypes.STRING(256),
          allowNull: false,
          defaultValue: 'DEFAULT',
          field: 'address'
        },
        config: {
          type: DataTypes.JSON,
          allowNull: false,
          field: 'config'
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
        modelName: 'settings',
        tableName: 'settings',
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
   * @memberof ModelSettings
   */
  static associate(models) {
    this.belongsTo(models.currencies)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelSettings[]}
   * @memberof ModelSettings
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelSettings[]} */
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
   * @returns {ModelSettings}
   * @memberof ModelSettings
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelSettings} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {ModelSettings} row
   * @return {ModelSettings}
   * @memberof ModelSettings
   */
  static formatForDisplay(row) {
    const { dataValues, fee } = row
    return _.assign(dataValues, { fee })
  }
}

module.exports = ModelSettings
