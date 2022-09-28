'use strict'
// @ts-check

const process = require('process')
const _ = require('lodash')
const moment = require('moment-timezone')
const Ajv = require('ajv')
const FileClient = require('@fizz.js/node-file-client/libs')
const { Validated, ValidationResult, ValidateSchema } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const Common = require('@fizz.js/node-common/libs')
const { ValidationError } = require('@fizz.js/node-errors/libs')
const Models = require('../models')

/**
 *
 *
 * @class LanguagesController
 */
class LanguagesController {
  /**
   * Creates an instance of LanguagesController.
   * @memberof LanguagesController
   */
  constructor() {
    this._ajv = new Ajv()
    this._client = new FileClient()
    this._init()
  }

  /**
   *
   *
   * @memberof LanguagesController
   */
  async _init() {
    const encoding = 'utf-8'
    const options = { encoding }
    const dir = `${process.cwd()}/assets/schema/i18n/`
    const files = ['private']
    files.map(async file => {
      const filename = `${dir}${file}.json`
      const payload = { filename }
      const json = await this._client.read(payload, options)
      this._ajv.addSchema(Common.fromJSON(json), file)
    })
  }

  /**
   * @see https://github.com/express-validator/express-validator/issues/527
   * @description `_.flatten()` でバリデータをフラットにしないと正常にバリデートされない（これはexpress middlewareの仕様）
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof LanguagesController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'i18n':
        return _.flatten([
          ValidateSchema({
            scope: {
              in: ['params', 'query'],
              exists: {
                checkNull: true,
                checkFalsy: true
              },
              custom: {
                options: value => ['public', 'private'].includes(value)
              }
            },
            locale: {
              in: ['params', 'query'],
              exists: {
                checkNull: true,
                checkFalsy: true
              },
              custom: {
                options: value => ['en', 'ja'].includes(value)
              }
            }
          })
        ])
      default:
        return Models.languages.getValidators(method)
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
   * @memberof LanguagesController
   */
  async getAll(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const sort = input.sort || 'id'
      const order = _.toUpper(`${input.order || 'DESC'}`)
      const filters = Common.fromJSON(input.filters || '{}')
      const where = {}
      const search = Common.fromJSON(input.search || '{}')
      const query = _.toLower(`${search.query || ''}`)
      if (!_.isEmpty(query)) {
        where[Models.op.or] = Models.whereFieldsLike(['id', 'status'], query)
      }

      if (!_.isEmpty(filters)) {
        where[Models.op.and] = _.keys(filters).map(k => {
          const v = _.get(filters, k)
          return _.isArray(v) ? Models.whereFieldIn(k, v) : Models.whereFieldLike(k, v)
        })
      }

      const createdAt = _.get(search, 'createdAt')
      if (!_.isEmpty(createdAt)) {
        const toDate = d =>
          moment(d)
            .clone()
            .format(CONSTANT.FORMAT.DATE.DB)
        const from = toDate(`${_.get(createdAt, 'from.date')} ${_.get(createdAt, 'from.time')}`)
        const to = toDate(`${_.get(createdAt, 'to.date')} ${_.get(createdAt, 'to.time')}`)
        where.createdAt = {
          [Models.op.between]: [from, to]
        }
      }

      const condition = {
        where: _.pickBy(where, _.identity),
        order: [[sort, order]]
      }

      const { count = 0 } = await Models.languages.findAndCountAll(condition)
      const total = _.toNumber(count || 0)
      const limit = _.toNumber(input.limit || 10)
      const page = _.toNumber(input.page || 1)
      const pages = _.ceil(total / limit)
      const offset = limit * (page - 1) || 0

      condition.limit = limit
      condition.offset = offset

      /** @type {Array<ModelLanguages>} */
      const result = await Models.languages.findAll(condition)
      const rows = result.map(item => item.dataValues)

      return ResponseFormatter.success(req, res, next, {
        rows,
        paginate: {
          total,
          page,
          pages,
          limit,
          sort,
          offset,
          search,
          filters,
          order
        }
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
   * @memberof LanguagesController
   */
  async getOne(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { id } = input
      const where = {
        id
      }

      /** @type {ModelLanguages} */
      const { dataValues } = await Models.languages.findOne({
        where: _.pickBy(where, _.identity)
      })

      return ResponseFormatter.success(req, res, next, dataValues)
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
   * @memberof LanguagesController
   */
  async create(req, res, next) {
    let tx
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      tx = await Models.startTransaction()
      const options = {
        transaction: tx,
        lock: tx.LOCK.UPDATE
      }

      const { scope, locale, i18N, status } = input
      const userId = _.get(req, 'user.id')
      const createdId = userId
      const updatedId = userId
      const payload = {
        scope,
        locale,
        i18N,
        status,
        createdId,
        updatedId
      }

      /** @type {ModelLanguages} */
      const model = await Models.languages.create(payload, options)
      const { id = undefined } = model

      await tx.commit()
      tx = null

      const { dataValues } = await Models.languages.findByPk(id, {
        useMaster: true
      })

      return ResponseFormatter.success(req, res, next, dataValues)
    } catch (error) {
      if (tx) {
        await tx.rollback()
      }

      return ResponseFormatter.raiseError(error, req, res, next)
    } finally {
      await Models.endTransaction()
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
   * @memberof LanguagesController
   */
  async update(req, res, next) {
    let tx
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      tx = await Models.startTransaction()
      const options = {
        transaction: tx,
        lock: tx.LOCK.UPDATE
      }

      const { id, scope, locale, i18N, status } = input
      if (!this._ajv.validate(scope, Common.fromJSON(i18N))) {
        throw new ValidationError(this._ajv.errorsText())
      }

      const userId = _.get(req, 'user.id')
      const updatedId = userId
      const model = await Models.languages.findByPk(id, options)
      const { dataValues } = await model.update(
        {
          scope,
          locale,
          i18N,
          status,
          updatedId
        },
        options
      )

      await tx.commit()
      tx = null

      return ResponseFormatter.success(req, res, next, dataValues)
    } catch (error) {
      if (tx) {
        await tx.rollback()
      }

      return ResponseFormatter.raiseError(error, req, res, next)
    } finally {
      await Models.endTransaction()
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
   * @memberof LanguagesController
   */
  async destroy(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { id } = input
      const model = await Models.languages.findByPk(id)
      await model.destroy()

      return ResponseFormatter.success(req, res, next)
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
   * @memberof LanguagesController
   */
  async status(req, res, next) {
    let tx
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      tx = await Models.startTransaction()
      const options = {
        transaction: tx,
        lock: tx.LOCK.UPDATE
      }

      const { id, status } = input
      const updatedId = _.get(req, 'user.id')
      const model = await Models.languages.findByPk(id, options)
      const payload = {
        status,
        updatedId
      }

      await model.update(payload, options)

      await tx.commit()
      tx = null

      const { dataValues } = await model.reload({
        useMaster: true
      })

      return ResponseFormatter.success(req, res, next, dataValues)
    } catch (error) {
      if (tx) {
        await tx.rollback()
      }

      return ResponseFormatter.raiseError(error, req, res, next)
    } finally {
      await Models.endTransaction()
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
   * @memberof I18nsController
   */
  async i18n(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { scope = 'private', locale = 'ja' } = input
      const where = {
        scope,
        locale
      }

      const { i18N } = await Models.languages.findOne({
        where: _.pickBy(where, _.identity)
      })

      return ResponseFormatter.success(req, res, next, i18N)
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = LanguagesController
