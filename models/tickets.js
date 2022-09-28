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
 * @class ModelTickets
 * @extends {Model}
 */
class ModelTickets extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelTickets}
   * @memberof ModelTickets
   */
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(16).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      userId: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        allowNull: false,
        references: {
        	model: 'users',
        	key: 'id'
        },
        field: 'user_id'
      },
      inquiryType: {
        type: DataTypes.ENUM('default','head_office_entry','master_agent_entry','agent_entry'),
        allowNull: false,
        defaultValue: 'default',
        field: 'inquiry_type'
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: '',
        field: 'title'
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'detail'
      },
      img: {
        type: DataTypes.BLOB(),
        allowNull: false,
        field: 'img'
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
      modelName: 'tickets',
      tableName: 'tickets',
      underscored: false,
      paranoid: true,
      sequelize
    })
  }

  /**
   * @example `this.belongsTo(models.your_models)` and also add into target model `this.hasMany(models.your_target_models)` or `this.hasOne(models.your_target_models)`
   * @static
   * @param {*} models
   * @memberof ModelTickets
   */
  static associate(models) {
    this.belongsTo(models.users)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelTickets[]}
   * @memberof ModelTickets
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelTickets[]} */
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
   * @returns {ModelTickets}
   * @memberof ModelTickets
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelTickets} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelTickets
