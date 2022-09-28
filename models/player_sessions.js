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
 * @class ModelPlayerSessions
 * @extends {Model}
 */
class ModelPlayerSessions extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelPlayerSessions}
   * @memberof ModelPlayerSessions
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
        playerId: {
          type: DataTypes.INTEGER(8).UNSIGNED,
          allowNull: false,
          references: {
            model: 'players',
            key: 'id'
          },
          field: 'player_id'
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
        modelName: 'playerSessions',
        tableName: 'player_sessions',
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
   * @memberof ModelPlayerSessions
   */
  static associate(models) {
    this.belongsTo(models.players)
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelPlayerSessions[]}
   * @memberof ModelPlayerSessions
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelPlayerSessions[]} */
      return await this.findAll(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {number} playerId
   * @returns {ModelPlayerSessions}
   * @memberof ModelPlayers
   */
  static async createToken(playerId) {
    try {
      const id = playerId
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

      /** @type {ModelPlayerSessions} */
      const { dataValues } = await this.create({
        playerId,
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
   * @param {number} playerId
   * @param {string} refreshToken
   * @returns {ModelPlayerSessions}
   * @memberof ModelPlayerSessions
   */
  static async findByPlayerId(playerId, refreshToken) {
    try {
      const Models = this.sequelize.models

      const status = CONSTANT.STATUS.ACTIVE
      const condition = {
        where: {
          playerId,
          refreshToken,
          status
        },
        include: [
          {
            model: Models.players,
            required: true
          }
        ]
      }

      /** @type {ModelPlayerSessions} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   * @param {number} playerId
   * @param {string} refreshToken
   * @returns {JwtToken|Error}
   * @memberof ModelPlayerSessions
   */
  static async refreshToken(playerId, refreshToken) {
    try {
      const Models = this.sequelize.models

      /** @type {ModelPlayers} */
      const player = await Models.players.getByPlayerId(playerId)
      if (!player) {
        throw new DatabaseError(CONSTANT.ERROR.ACCOUNT_DOES_NOT_EXIST)
      }

      await Models.playerSessions.flushTokens(playerId, refreshToken)
      return await Models.playerSessions.createToken(playerId)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {number} playerId
   * @returns {number}
   * @memberof ModelPlayerSessions
   */
  static async flushTokens(playerId) {
    try {
      const Models = this.sequelize.models

      const status = CONSTANT.STATUS.ACTIVE
      const condition = {
        where: {
          playerId,
          status
        },
        include: [
          {
            model: Models.players,
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

module.exports = ModelPlayerSessions
