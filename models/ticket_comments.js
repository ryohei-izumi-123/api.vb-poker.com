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
 * @class ModelTicketComments
 * @extends {Model}
 */
class ModelTicketComments extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelTicketComments}
   * @memberof ModelTicketComments
   */
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      ticketId: {
        type: DataTypes.INTEGER(16).UNSIGNED,
        allowNull: false,
        references: {
        	model: 'tickets',
        	key: 'id'
        },
        field: 'ticket_id'
      },
      commentedBy: {
        type: DataTypes.ENUM('customer','user'),
        allowNull: false,
        defaultValue: 'user',
        field: 'commented_by'
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'comment'
      },
      status: {
        type: DataTypes.ENUM('active','inactive','pending'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'status'
      },
      img: {
        type: DataTypes.BLOB(),
        allowNull: false,
        field: 'img'
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
      modelName: 'ticketComments',
      tableName: 'ticket_comments',
      underscored: false,
      paranoid: true,
      sequelize
    })
  }

  /**
   * @example `this.belongsTo(models.your_models)` and also add into target model `this.hasMany(models.your_target_models)` or `this.hasOne(models.your_target_models)`
   * @static
   * @param {*} models
   * @memberof ModelTicketComments
   */
  static associate(models) {
    this.belongsTo(models.tickets)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelTicketComments[]}
   * @memberof ModelTicketComments
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelTicketComments[]} */
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
   * @returns {ModelTicketComments}
   * @memberof ModelTicketComments
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelTicketComments} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelTicketComments
