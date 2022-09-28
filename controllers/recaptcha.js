'use strict'
// @ts-check

const config = require('config')
const { Validated, ValidationResult, Validate } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Logger = require('@fizz.js/node-logger/libs')
const Request = require('@fizz.js/node-request/libs')
const Common = require('@fizz.js/node-common/libs')

/**
 *
 *
 * @class RecaptchaController
 */
class RecaptchaController {
  /**
   *
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof RecaptchaController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'verify':
        return [
          Validate('token')
            .exists({
              checkNull: true,
              checkFalsy: true
            })
            .isLength({
              min: 1,
              max: 4096
            })
            .trim()
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
   * @returns
   *
   * @memberof RecaptchaController
   */
  async verify(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const threshold = 0.5
      const ip = Common.getRemoteAddress(req)
      const { baseUrl, secret } = config.google.recaptcha.v3
      const { token } = input
      const url = `${baseUrl}?secret=${secret}&response=${token}&remoteip=${ip}`
      const agent = new Request()
      const body = await agent.post(url)
      Logger.info(body)
      const { score } = body
      const result = score >= threshold
      Logger.info(`[GOOGLE RECAPTCHA SCORE]: ${score} [IP]: ${ip}`)

      return ResponseFormatter.success(req, res, next, {
        result
      })
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = RecaptchaController
