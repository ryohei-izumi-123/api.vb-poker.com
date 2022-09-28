'use strict'
// @ts-check

const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const _ = require('lodash')
const config = require('config')
const process = require('process')
const moment = require('moment-timezone')
const Jwt = require('@fizz.js/node-jwt/libs')
const Common = require('@fizz.js/node-common/libs')
const { DatabaseError } = require('@fizz.js/node-errors/libs')

/**
 *
 *
 * @class ModelUserSessions
 * @extends {Model}
 */
class ModelUserSessions extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelUserSessions}
   * @memberof ModelUserSessions
   */
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
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
        accessToken: {
          type: DataTypes.STRING(512),
          allowNull: false,
          field: 'access_token'
        },
        refreshToken: {
          type: DataTypes.STRING(128),
          allowNull: false,
          field: 'refresh_token'
        },
        expiredAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'expired_at'
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
        modelName: 'userSessions',
        tableName: 'user_sessions',
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
   * @memberof ModelUserSessions
   */
  static associate(models) {
    this.belongsTo(models.users)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelUserSessions[]}
   * @memberof ModelUserSessions
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelUserSessions[]} */
      return await this.findAll(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {number} userId
   * @returns {ModelUserSessions}
   * @memberof ModelUsers
   */
  static async createToken(userId) {
    try {
      const id = userId
      const refreshToken = Common.getUid(64)
      const payload = {
        id,
        scope: CONSTANT.SCOPE.API.PRIVATE,
        refreshToken
      }
      const { expiresIn = undefined } = config.jwt
      const salt = process.env.JWT_SALT
      const accessToken = Jwt.sign(payload, salt, {
        expiresIn
      })
      const status = CONSTANT.STATUS.ACTIVE
      const [$1, $2] = _.toString(expiresIn).split(' ')
      const expiredAt = moment()
        .clone()
        .add(_.toNumber($1), $2)
        .format(CONSTANT.FORMAT.DATE.DB)

      /** @type {ModelUserSessions} */
      const { dataValues } = await this.create({
        userId,
        accessToken,
        refreshToken,
        expiredAt,
        status,
        createdId: 0,
        updatedId: 0
      })

      return dataValues
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {number} userId
   * @param {string} refreshToken
   * @returns {ModelUserSessions}
   * @memberof ModelUserSessions
   */
  static async findByUserId(userId, refreshToken) {
    try {
      const Models = this.sequelize.models

      const status = CONSTANT.STATUS.ACTIVE
      const condition = {
        where: {
          userId,
          refreshToken,
          status
        },
        include: [
          {
            model: Models.users,
            required: true
          }
        ]
      }

      /** @type {ModelUserSessions} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {number} userId
   * @param {string} refreshToken
   * @returns {JwtToken|Error}
   * @memberof ModelUserSessions
   */
  static async refreshToken(userId, refreshToken) {
    try {
      const Models = this.sequelize.models

      /** @type {ModelUsers} */
      const user = await Models.users.getByUserId(userId)
      if (!user) {
        throw new DatabaseError(CONSTANT.ERROR.ACCOUNT_DOES_NOT_EXIST)
      }

      await Models.userSessions.flushTokens(userId, refreshToken)
      return await Models.userSessions.createToken(userId)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {number} userId
   * @returns {number}
   * @memberof ModelUserSessions
   */
  static async flushTokens(userId) {
    try {
      const Models = this.sequelize.models

      const status = CONSTANT.STATUS.ACTIVE
      const condition = {
        where: {
          userId,
          status
        },
        include: [
          {
            model: Models.users,
            required: true
          }
        ]
      }

      return await this.destroy(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelUserSessions
