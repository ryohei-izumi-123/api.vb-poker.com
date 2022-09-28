'use strict'
// @ts-check

const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const process = require('process')

/**
 *
 *
 * @class AssetsController
 */
class AssetsController {
  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof AssetsController
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
   * @memberof AssetsController
   */
  async get(req, res, next) {
    try {
      const [, , ...segments] = `${req.path}`.split('/')
      const filename = `${process.cwd()}/${segments.join('/')}`

      return ResponseFormatter.sendFile(req, res, next, filename)
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = AssetsController
