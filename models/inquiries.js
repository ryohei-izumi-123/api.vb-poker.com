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
 * @class ModelInquiries
 * @extends {Model}
 */
class ModelInquiries extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelInquiries}
   * @memberof ModelInquiries
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
      inquiryType: {
        type: DataTypes.ENUM('default'),
        allowNull: false,
        defaultValue: 'default',
        field: 'inquiry_type'
      },
      fullName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: '',
        field: 'full_name'
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        field: 'email'
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
      modelName: 'inquiries',
      tableName: 'inquiries',
      underscored: false,
      paranoid: true,
      sequelize
    })
  }

  /**
   * @example `this.belongsTo(models.your_models)` and also add into target model `this.hasMany(models.your_target_models)` or `this.hasOne(models.your_target_models)`
   * @static
   * @param {*} models
   * @memberof ModelInquiries
   */
  static associate(models) {
		// TODO: implement your relations
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelInquiries[]}
   * @memberof ModelInquiries
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelInquiries[]} */
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
   * @returns {ModelInquiries}
   * @memberof ModelInquiries
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelInquiries} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelInquiries
