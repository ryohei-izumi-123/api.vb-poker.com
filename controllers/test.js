'use strict'
// @ts-check

const { Validate, Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Logger = require('@fizz.js/node-logger/libs')
const Common = require('@fizz.js/node-common/libs')
const OpenSSL = require('@fizz.js/node-openssl/libs')
const Models = require('../models')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class TestController
 */
class TestController {
  /**
   *
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof TestController
   */
  validationMiddleware(method = '') {
    const validators = []
    switch (method) {
      case 'sendToQueue':
      case 'encodeSecret':
      case 'decodeSecret':
        validators.push(Validate('secret'))
        break

      default:
        break
    }
    return validators
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns
   *
   * @memberof TestController
   */
  async test(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const target = Common.getRequestBaseUri(req)
      return ResponseFormatter.success(req, res, next, {
        input,
        target
      })
    } catch (error) {
      Logger.error(error)
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof TestController
   */
  async encodeSecret(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const result = OpenSSL.encrypt(input.secret)
      if (!result) {
        throw new Error()
      }

      return ResponseFormatter.success(req, res, next, {
        result
      })
    } catch (error) {
      Logger.error(error)
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof TestController
   */
  async decodeSecret(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const result = OpenSSL.decrypt(input.secret)
      if (!result) {
        throw new Error()
      }

      return ResponseFormatter.success(req, res, next, {
        result
      })
    } catch (error) {
      Logger.error(error)
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
   * @memberof TestController
   */
  async model(req, res, next) {
    try {
      // const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const status = CONSTANT.STATUS.ACTIVE
      const condition = {
        where: {
          status
        }
      }
      const result = await Models.players.findAll(condition)

      return ResponseFormatter.success(req, res, next, result)
    } catch (error) {
      Logger.error(error)
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = TestController
