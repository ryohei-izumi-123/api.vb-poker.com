'use strict'
// @ts-check

const _ = require('lodash')
const { ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Models = require('../models')

/**
 *
 *
 * @class OptionsController
 */
class OptionsController {
  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof OptionsController
   */
  validationMiddleware(method = '') {
    return []
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns
   *
   * @memberof OptionsController
   */
  async getAll(req, res, next) {
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const sort = 'id'
      const order = 'DESC'
      const where = {}
      const getCondition = table => {
        const attributes = [
          'id',
          'status',
          'createdId',
          'createdAt',
          'updatedId',
          'updatedAt',
          'deletedId',
          'deletedAt',
          'logical'
        ]

        switch (table) {
          case 'users':
          case 'customers':
            attributes.push('username', 'firstName', 'lastName')
            break

          case 'currencies':
            attributes.push('name', 'symbol')
            break

          case 'countries':
            attributes.push('name', 'callPrefix')
            break

          case 'products':
          case 'categories':
            attributes.push('name')
            break

          default:
            break
        }

        return {
          attributes,
          where: _.pickBy(where, _.identity),
          order: [[sort, order]]
        }
      }
      const tables = ['products', 'categories', 'countries', 'currencies', 'customers', 'users']
      const result = {}
      for (let table of tables) {
        const rows = await Models[table].findAll(getCondition(table))
        _.set(result, table, rows)
      }

      return ResponseFormatter.success(req, res, next, result)
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = OptionsController
