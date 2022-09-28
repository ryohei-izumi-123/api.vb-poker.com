'use strict'
// @ts-check

const { Sequelize } = require('@fizz.js/node-model/libs')
const {
  Model,
  DataTypes
} = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class ModelCountries
 * @extends {Model}
 */
class ModelCountries extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelCountries}
   * @memberof ModelCountries
   */
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(4).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'name'
      },
      iso3166A2: {
        type: DataTypes.STRING(2),
        allowNull: false,
        field: 'iso3166_a2'
      },
      iso3166A3: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: 'iso3166_a3'
      },
      callPrefix: {
        type: DataTypes.STRING(4),
        allowNull: false,
        field: 'call_prefix'
      },
      status: {
        type: DataTypes.ENUM('active','inactive','pending'),
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
    }, {
      modelName: 'countries',
      tableName: 'countries',
      underscored: false,
      paranoid: true,
      sequelize
    })
  }

  /**
   * @example `this.belongsTo(models.your_models)` and also add into target model `this.hasMany(models.your_target_models)` or `this.hasOne(models.your_target_models)`
   * @static
   * @param {*} models
   * @memberof ModelCountries
   */
  static associate(models) {
		this.hasMany(models.customers)
    this.hasMany(models.users)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelCountries[]}
   * @memberof ModelCountries
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelCountries[]} */
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
   * @returns {ModelCountries}
   * @memberof ModelCountries
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelCountries} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelCountries
