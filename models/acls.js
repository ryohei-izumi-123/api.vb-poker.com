'use strict'
// @ts-check

const _ = require('lodash')
const { Sequelize } = require('@fizz.js/node-model/libs')
const { Model, DataTypes } = Sequelize
const Logger = require('@fizz.js/node-logger/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class ModelAcls
 * @extends {Model}
 */
class ModelAcls extends Model {
  /**
   *
   *
   * @static
   * @param {*} sequelize
   * @returns {ModelAcls}
   * @memberof ModelAcls
   */
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER(16).UNSIGNED,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          field: 'id'
        },
        role: {
          type: DataTypes.ENUM('administrator', 'manager', 'operator', 'head_office', 'master_agent', 'agent', 'na'),
          allowNull: false,
          defaultValue: 'na',
          unique: true,
          field: 'role'
        },
        permissions: {
          type: DataTypes.JSON,
          allowNull: false,
          field: 'permissions'
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
        modelName: 'acls',
        tableName: 'acls',
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
   * @memberof ModelAcls
   */
  static associate(models) {
    this.hasMany(models.users, { foreignKey: 'role', targetKey: 'role' })
  }

  /**
   *
   *
   * @static
   * @param {string} [status=CONSTANT.STATUS.ACTIVE]
   * @returns {ModelAcls[]}
   * @memberof ModelAcls
   */
  static async findAllByStatus(status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          status
        }
      }

      /** @type {ModelAcls[]} */
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
   * @returns {ModelAcls}
   * @memberof ModelAcls
   */
  static async findById(id, status = CONSTANT.STATUS.ACTIVE) {
    try {
      const condition = {
        where: {
          id,
          status
        }
      }

      /** @type {ModelAcls} */
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
   * @param {*} role
   * @return {*}
   * @memberof ModelAcls
   */
  static async findByRole(role) {
    try {
      const condition = {
        where: {
          role
        }
      }

      /** @type {ModelAcls} */
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
   * @return {Object[]}
   * @memberof ModelAcls
   */
  static async getAclAsArray() {
    try {
      const Models = this.sequelize.models
      const rows = await this.findAll()

      return Models.acls.mapAsArray(rows)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @return {Object}
   * @memberof ModelAcls
   */
  static async getAclAsObject() {
    try {
      const Models = this.sequelize.models
      const rows = await this.findAll()

      return Models.acls.mapAsObject(rows)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   *
   * @static
   * @param {ModelAcls[]} [rows=[]]
   * @return {Object}
   * @memberof ModelAcls
   */
  static mapAsObject(rows = []) {
    const possession = 'any'
    const attributes = '*'
    const result = {}

    rows.map(({ role, permissions = [] }) => {
      _.set(result, role, {})
      permissions.map(({ resource, crud = [] }) => {
        _.set(result, `${role}.${resource}`, {})
        crud
          .filter(({ value }) => value)
          .map(({ action }) => `${action}:${possession}`)
          .map(action => _.set(result, `${role}.${resource}.${action}`, [attributes]))
      })
    })

    return result
  }

  /**
   *
   *
   * @static
   * @param {ModelAcls[]} [rows=[]]
   * @return {Object[]}
   * @memberof ModelAcls
   */
  static mapAsArray(rows = []) {
    const possession = 'any'
    const attributes = '*'
    const result = []

    rows.map(({ role, permissions = [] }) =>
      permissions.map(({ resource, crud = [] }) =>
        crud
          .filter(({ value }) => value)
          .map(({ action }) => `${action}:${possession}`)
          .map(action => result.push({ role, resource, action, attributes }))
      )
    )

    return result
  }
}

module.exports = ModelAcls
