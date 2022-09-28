'use strict'
// @ts-check

const _ = require('lodash')
const bcrypt = require('bcryptjs')
const config = require('config')
const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes, Op } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const Common = require('@fizz.js/node-common/libs')
const { DatabaseError } = require('@fizz.js/node-errors/libs')

/**
 *
 *
 * @class ModelUsers
 * @extends {Model}
 */
class ModelUsers extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelUsers}
   * @memberof ModelUsers
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
          type: DataTypes.ENUM('administrator', 'manager', 'operator'),
          allowNull: false,
          defaultValue: 'operator',
          field: 'role',
          validate: {
            isIn: [['administrator', 'manager', 'operator']]
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
        modelName: 'users',
        tableName: 'users',
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
   * @memberof ModelUsers
   */
  static associate(models) {
    this.belongsTo(models.countries)
    this.belongsTo(models.acls, { foreignKey: 'role', targetKey: 'role' })
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelUsers[]}
   * @memberof ModelUsers
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelUsers[]} */
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
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelUsers} */
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
   * @param {number} id
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async getByUserId(id) {
    try {
      const Models = this.sequelize.models
      const condition = {
        where: {
          id
        },
        include: [
          {
            model: Models.countries,
            required: true
          },
          {
            model: Models.acls,
            required: true,
            as: 'acl',
            foreignKey: 'role',
            targetKey: 'role'
          }
        ]
      }
      const { fullName, dataValues } = await this.findOne(condition)
      /** @type {ModelUsers} */

      return _.assign(dataValues, {
        fullName
      })
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {string} username
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async getByUsername(username) {
    try {
      const Models = this.sequelize.models
      const condition = {
        where: {
          username
        },
        include: [
          {
            model: Models.countries,
            required: true
          },
          {
            model: Models.acls,
            required: true,
            as: 'acl',
            foreignKey: 'role',
            targetKey: 'role'
          }
        ]
      }
      const { fullName, dataValues } = await this.findOne(condition)
      /** @type {ModelUsers} */

      return _.assign(dataValues, {
        fullName
      })
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {string} username
   * @param {string} password
   * @returns {ModelUsers}
   * @throws {Error}
   * @memberof ModelUsers
   */
  static async authenticate(username, password) {
    try {
      const Models = this.sequelize.models

      /** @type {ModelUsers} */
      const user = await Models.users.getByUsername(username)
      if (!user) {
        throw new DatabaseError(CONSTANT.ERROR.ACCOUNT_DOES_NOT_EXIST)
      }

      if (CONSTANT.STATUS.ACTIVE !== user.status) {
        throw new DatabaseError(CONSTANT.ERROR.ACCOUNT_HAS_BEEN_LOCKED)
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new DatabaseError(CONSTANT.ERROR.PASSWORD_DOES_NOT_MATCH)
      }

      return user
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @deprecated
   * @param {number} id
   * @param {string} [key='$.default']
   * @param {boolean} [unquoted=false]
   * @returns {IUserConfig}
   * @memberof ModelUsers
   */
  static async getConfig(id, key = '$.default', unquoted = false) {
    try {
      const field = unquoted
        ? this.sequelize.fn(
            'JSON_UNQUOTE',
            this.sequelize.fn(
              'COALESCE',
              this.sequelize.fn('JSON_EXTRACT', this.sequelize.col('config'), key),
              this.sequelize.fn('JSON_OBJECT')
            )
          )
        : this.sequelize.fn('JSON_EXTRACT', this.sequelize.col('config'), key)

      const condition = {
        attributes: [[field, 'config']],
        where: {
          id
        }
      }

      /** @type {ModelUsers} */
      const { config } = await this.findOne(condition)
      return config
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @deprecated
   * @param {number} id
   * @param {string} [key='$.default']
   * @param {*} [value='']
   * @param {boolean} [unquoted=false]
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async setConfig(id, key = '$.default', value = '', unquoted = false) {
    try {
      const condition = {
        where: {
          id
        }
      }

      /** @type {ModelUsers} */
      const { fullName, dataValues } = await this.update(
        {
          config: this.sequelize.fn(
            'JSON_SET',
            this.sequelize.col('config'),
            key,
            unquoted ? this.sequelize.fn('JSON_UNQUOTE', value) : value
          )
        },
        condition
      )

      /** @type {ModelUsers} */
      return _.assign(dataValues, {
        fullName
      })
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   * @deprecated
   * @param {number} id
   * @returns {ITotpMethod}
   * @memberof ModelUsers
   */
  static async getSecurityMethodFromConfig(id) {
    try {
      const Models = this.sequelize.models
      return await Models.users.getConfig(id, '$.security.method')
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   * @deprecated
   * @param {number} id
   * @param {ITotpMethod} [value='google']
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async setSecurityMethodFromConfig(id, value = 'google') {
    try {
      const Models = this.sequelize.models
      return await Models.users.setConfig(id, '$.security.method', value)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   * @deprecated
   * @param {number} id
   * @returns {IUserConfigSecurity}
   * @memberof ModelUsers
   */
  static async getSecuritySeedFromConfig(id) {
    try {
      const Models = this.sequelize.models
      const result = await Models.users.getConfig(id, '$.security.seed')
      if (!_.isObjectLike(result)) {
        return Common.fromJSON(result)
      }

      return result
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @deprecated
   * @param {number} id
   * @param {IUserConfigSecurity} value
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async setSecuritySeedFromConfig(id, value) {
    try {
      const Models = this.sequelize.models
      return await Models.users.setConfig(id, '$.security.seed', Common.toJSON(value))
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {number} id
   * @returns {IUserConfigSecurity}
   * @memberof ModelUsers
   */
  static async getSecurityConfig(id) {
    try {
      const user = await this.findByPk(id)
      return _.get(user, 'config.security')
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
   * @param {IUserConfigSecurity} security
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async setSecurityConfig(id, security) {
    try {
      const Models = this.sequelize.models
      const user = await this.findByPk(id)
      const config = _.assign(_.cloneDeep(_.get(user, 'config')), {
        security
      })
      await user.update({
        config
      })

      return await user.reload({
        useMaster: true,
        include: [
          {
            model: Models.countries,
            required: true
          },
          {
            model: Models.acls,
            required: true,
            as: 'acl',
            foreignKey: 'role',
            targetKey: 'role'
          }
        ]
      })
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {ModelUsers} payload
   * @returns {ModelUsers}
   * @memberof ModelUsers
   */
  static async updateUser(payload) {
    let tx
    try {
      const Models = this.sequelize.models
      tx = await this.sequelize.startTransaction()
      const options = {
        transaction: tx,
        lock: tx.LOCK.UPDATE
      }

      const { id } = payload
      const user = await this.findByPk(id, options)
      const data = _.cloneDeep(_.pickBy(payload, v => !_.isUndefined(v)))
      _.unset(data, 'id')
      _.unset(data, 'username')

      await user.update(data, options)
      await tx.commit()
      tx = null

      return await user.reload({
        useMaster: true,
        include: [
          {
            model: Models.countries,
            required: true
          },
          {
            model: Models.acls,
            required: true,
            as: 'acl',
            foreignKey: 'role',
            targetKey: 'role'
          }
        ]
      })
    } catch (error) {
      Logger.error(error)
      if (tx) {
        await tx.rollback()
      }

      throw error
    } finally {
      await this.sequelize.endTransaction()
    }
  }

  /**
   *
   *
   * @static
   * @description 自分より上の権限は表示しないようにwhere句の条件を生成する。
   * @param {ModelUsers} user
   * @return {Object}
   * @memberof ModelUsers
   */
  static whereByRole(user) {
    const toNumber = role => {
      switch (role) {
        case 'administrator':
          return 1
        case 'manager':
          return 2
        case 'operator':
          return 3
        default:
          return Number.MAX_SAFE_INTEGER
      }
    }
    const roles = ['administrator', 'manager', 'operator']
    const value = roles.filter(role => toNumber(role) >= toNumber(_.get(user, 'role')))

    return {
      [Op.in]: value
    }
  }
}

module.exports = ModelUsers
