'use strict'
// @ts-check

const uuid = require('uuid/v4')
const FileClient = require('@fizz.js/node-file-client/libs')
const { Validate, Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Logger = require('@fizz.js/node-logger/libs')

/**
 *
 *
 * @class FilesController
 */
class FilesController {
  /**
   * Creates an instance of LanguagesController.
   * @memberof FilesController
   */
  constructor() {
    this._client = new FileClient()
  }

  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof FilesController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'create':
      default:
        return [
          Validate('name').exists({
            checkNull: true,
            checkFalsy: true
          }),
          Validate('size')
            .isNumeric()
            .isInt({
              min: 1,
              max: 100000000
            })
            .exists({
              checkNull: true,
              checkFalsy: true
            }),
          Validate('type')
            .isMimeType()
            .exists({
              checkNull: true,
              checkFalsy: true
            })
            .custom(value => {
              const mimetypes = ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml']
              return mimetypes.includes(value)
            }),
          Validate('blob').exists({
            checkNull: true,
            checkFalsy: true
          })
        ]
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
   * @memberof FilesController
   */
  async create(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { name, blob } = input
      const payload = {
        name: `${uuid()}${name}`,
        data: blob
      }
      const { url } = await this._saveToOss(payload)

      return ResponseFormatter.success(req, res, next, { url })
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }

  /**
   *
   *
   * @param {string} [payload={ name: '', data: '' }]
   * @return {*}
   * @memberof FilesController
   */
  async _saveToOss(payload = { name: '', data: '' }) {
    try {
      const { name, data } = payload
      const file = this._client.toBuffer({ data })

      return await this._client.putObjectFromBuffer({ name, file })
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }
}

module.exports = FilesController
