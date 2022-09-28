'use strict'
// @ts-check

const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class ModelPlayers
 * @extends {Model}
 */
class ModelPlayers extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelPlayers}
   * @memberof ModelPlayers
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
        externalId: {
          type: DataTypes.STRING(128),
          allowNull: false,
          field: 'external_id'
        },
        rank: {
          type: DataTypes.ENUM('silver', 'gold', 'platinum', 'diamond', 'black'),
          allowNull: false,
          defaultValue: 'silver',
          field: 'rank'
        },
        balance: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          field: 'balance'
        },
        name: {
          type: DataTypes.STRING(32),
          allowNull: false,
          field: 'name'
        },
        photo: {
          type: DataTypes.STRING(256),
          allowNull: false,
          defaultValue: '',
          field: 'photo'
        },
        ipAddress: {
          type: DataTypes.STRING(64),
          allowNull: false,
          defaultValue: '',
          field: 'ip_address'
        },
        userAgent: {
          type: DataTypes.STRING(256),
          allowNull: false,
          defaultValue: '',
          field: 'user_agent'
        },
        fingerPrint: {
          type: DataTypes.STRING(64),
          allowNull: false,
          defaultValue: '',
          field: 'finger_print'
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
          field: 'failed_login_attempt'
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
        modelName: 'players',
        tableName: 'players',
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
   * @memberof ModelPlayers
   */
  static associate(models) {
    // TODO: implement your relations
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelPlayers[]}
   * @memberof ModelPlayers
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelPlayers[]} */
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
   * @param {ModelPlayers} [payload={}]
   * @returns {ModelPlayers}
   * @memberof ModelPlayers
   */
  static async findOrCreatePlayer(payload = {}) {
    let tx
    try {
      const {
        name,
        photo,
        rank = 'silver',
        externalId,
        balance = 0,
        userAgent,
        fingerPrint,
        ipAddress = '127.0.0.1',
        failedLoginAttempt = 0,
        status = CONSTANT.STATUS.ACTIVE,
        createdId = 0,
        updatedId = 0,
        config = {}
      } = payload

      /** @type {ModelPlayers} */
      const exists = await this.findOne({
        where: {
          externalId
        }
      })
      if (exists) {
        return exists
      }

      tx = await this.sequelize.startTransaction()
      const options = {
        transaction: tx,
        lock: tx.LOCK.UPDATE
      }

      /** @type {ModelPlayers} */
      const result = await this.create(
        {
          name,
          photo,
          rank,
          externalId,
          balance,
          userAgent,
          fingerPrint,
          ipAddress,
          failedLoginAttempt,
          config,
          status,
          createdId,
          updatedId
        },
        options
      )

      await tx.commit()
      tx = null

      return await this.findByPk(result.id, {
        useMaster: true
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
   * @param {number} id
   * @returns {ModelPlayers}
   * @memberof ModelPlayers
   */
  static async getByPlayerId(id) {
    try {
      const condition = {
        where: {
          id
        }
      }
      /** @type {ModelUsers} */
      const { dataValues } = await this.findOne(condition)
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
   * @param {number} id
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelPlayers}
   * @memberof ModelPlayers
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelPlayers} */
      return await this.findOne(condition)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = ModelPlayers
