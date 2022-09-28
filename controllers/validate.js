'use strict'
// @ts-check

const _ = require('lodash')
const bcrypt = require('bcryptjs')
const { Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Models = require('../models')

/**
 *
 *
 * @class ValidateController
 */
class ValidateController {
  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof ValidateController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'unique':
        return Models.getValidatorForUnique()

      case 'password':
        return [Models.users.getValidator('password')]

      default:
        return []
    }
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns
   *
   * @memberof ValidateController
   */
  async unique(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { id = undefined, field = undefined, value = undefined } = input
      const model = Models.getModelName(input.model)
      const where = {
        [field]: value
      }
      if (id) {
        where.id = {
          [Models.op.ne]: id
        }
      }

      /** @type {Array<Model>} */
      const result = await Models[model].findAll({
        where: _.pickBy(where, _.identity)
      })
      const rows = result.map(item => item.dataValues)

      return ResponseFormatter.success(req, res, next, {
        result: _.isEmpty(rows)
      })
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns
   *
   * @memberof ValidateController
   */
  async password(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const userId = req.user.id
      const user = await Models.users.getByUserId(userId)
      const result = bcrypt.compareSync(input.password, user.password)

      return ResponseFormatter.success(req, res, next, {
        result
      })
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = ValidateController
