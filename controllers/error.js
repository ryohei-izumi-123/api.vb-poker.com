'use strict'
// @ts-check

const { Validate, Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Logger = require('@fizz.js/node-logger/libs')

/**
 *
 *
 * @class ErrorController
 */
class ErrorController {
  /**
   *
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof ErrorController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'error':
        return [
          Validate('error').exists({
            checkNull: true,
            checkFalsy: true
          })
        ]

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
   * @returns {*}
   *
   * @memberof ErrorController
   */
  async error(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { error = undefined } = input
      Logger.error(error)
      return ResponseFormatter.success(req, res, next, {
        error
      })
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = ErrorController
