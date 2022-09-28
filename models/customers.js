'use strict'
// @ts-check

const bcrypt = require('bcryptjs')
const config = require('config')
const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class ModelCustomers
 * @extends {Model}
 */
class ModelCustomers extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelCustomers}
   * @memberof ModelCustomers
   */
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'id'
        },
        role: {
          type: DataTypes.ENUM('head_office', 'master_agent', 'agent', 'na'),
          allowNull: false,
          defaultValue: 'na',
          field: 'role',
          validate: {
            isIn: [['head_office', 'master_agent', 'agent', 'na']]
          }
        },
        username: {
          type: DataTypes.STRING(32),
          allowNull: false,
          field: 'username',
          validate: {
            isAlphanumeric: true,
            isHalfWidth: () => true,
            isTrim: () => true,
            len: [4, 16]
          }
        },
        password: {
          type: DataTypes.STRING(256),
          allowNull: false,
          field: 'password',
          validate: {
            isHalfWidth: () => true,
            isTrim: () => true,
            len: [6, 256]
          },
          set(val) {
            this.setDataValue('password', bcrypt.hashSync(val, config.bcrypt.strength))
          }
        },
        firstName: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: '',
          field: 'first_name',
          validate: {
            len: [1, 16]
          }
        },
        lastName: {
          type: DataTypes.STRING(32),
          allowNull: false,
          defaultValue: '',
          field: 'last_name',
          validate: {
            len: [1, 16]
          }
        },
        fullName: {
          type: new DataTypes.VIRTUAL(DataTypes.STRING(64), ['fullName']),
          allowNull: true,
          field: 'full_name',
          get() {
            return this.getDataValue('fullName')
          },
          set(val) {}
        },
        email: {
          type: DataTypes.STRING(128),
          allowNull: false,
          defaultValue: '',
          field: 'email',
          validate: {
            isEmail: true,
            len: [4, 256]
          }
        },
        phone: {
          type: DataTypes.STRING(16),
          allowNull: false,
          defaultValue: '',
          field: 'phone',
          validate: {
            isNumeric: true,
            len: [8, 16]
          }
        },
        countryId: {
          type: DataTypes.INTEGER(4).UNSIGNED,
          allowNull: false,
          references: {
            model: 'countries',
            key: 'id'
          },
          field: 'country_id'
        },
        mfaKey: {
          type: DataTypes.STRING(64),
          allowNull: true,
          field: 'mfa_key',
          defaultValue: null
        },
        ipAddress: {
          type: DataTypes.STRING(64),
          allowNull: false,
          defaultValue: '',
          field: 'ip_address',
          validate: {
            len: [0, 64],
            isIPv4: true
          },
          canSkipValiation: true
        },
        userAgent: {
          type: DataTypes.STRING(256),
          allowNull: false,
          defaultValue: '',
          field: 'user_agent',
          validate: {
            len: [0, 256]
          },
          canSkipValiation: true
        },
        fingerPrint: {
          type: DataTypes.STRING(64),
          allowNull: false,
          defaultValue: '',
          field: 'finger_print',
          validate: {
            len: [0, 64]
          },
          canSkipValiation: true
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_login'
        },
        failedLoginAttempt: {
          type: DataTypes.INTEGER(1),
          allowNull: false,
          defaultValue: '0',
          field: 'failed_login_attempt',
          canSkipValiation: true
        },
        remarks: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'remarks'
        },
        config: {
          type: DataTypes.JSON,
          allowNull: false,
          field: 'config',
          canSkipValiation: true
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive', 'pending'),
          allowNull: false,
          defaultValue: 'pending',
          field: 'status',
          validate: {
            isIn: [['active', 'inactive', 'pending']]
          }
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
        modelName: 'customers',
        tableName: 'customers',
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
   * @memberof ModelCustomers
   */
  static associate(models) {
    this.belongsTo(models.countries)
    this.hasMany(models.orders)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelCustomers[]}
   * @memberof ModelCustomers
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelCustomers[]} */
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
   * @returns {ModelCustomers}
   * @memberof ModelCustomers
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelCustomers} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelCustomers
