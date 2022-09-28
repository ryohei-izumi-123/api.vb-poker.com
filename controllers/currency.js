'use strict'
// @ts-check

const _ = require('lodash')
const moment = require('moment-timezone')
const { Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Common = require('@fizz.js/node-common/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const Models = require('../models')
/**
 *
 *
 * @class CurrenciesController
 */
class CurrenciesController {
  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof CurrenciesController
   */
  validationMiddleware(method = '') {
    return Models.currencies.getValidators(method)
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns
   *
   * @memberof CurrenciesController
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
        where[Models.op.or] = Models.whereFieldsLike(['name', 'symbol'], query)
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

      const { count = 0 } = await Models.currencies.findAndCountAll(condition)
      const total = _.toNumber(count || 0)
      const limit = _.toNumber(input.limit || 10)
      const page = _.toNumber(input.page || 1)
      const pages = _.ceil(total / limit)
      const offset = limit * (page - 1) || 0

      condition.limit = limit
      condition.offset = offset

      /** @type {Array<ModelCurrencies>} */
      const result = await Models.currencies.findAll(condition)
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
   * @memberof CurrenciesController
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

      /** @type {ModelCurrencies} */
      const { dataValues } = await Models.currencies.findOne({
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
   * @memberof CurrenciesController
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

      const { name, symbol, status } = input
      const userId = _.get(req, 'user.id')
      const createdId = userId
      const updatedId = userId
      const payload = {
        name,
        symbol,
        status,
        createdId,
        updatedId
      }

      /** @type {ModelCurrencies} */
      const model = await Models.currencies.create(payload, options)
      const { id = undefined } = model

      await tx.commit()
      tx = null

      const { dataValues } = await Models.currencies.findByPk(id, {
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
   * @memberof CurrenciesController
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

      const { id, name, symbol } = input
      const userId = _.get(req, 'user.id')
      const updatedId = userId
      const status = CONSTANT.STATUS.INACTIVE
      const model = await Models.currencies.findByPk(id, options)
      await model.update(
        {
          name,
          symbol,
          status,
          updatedId
        },
        options
      )

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
   * @memberof CurrenciesController
   */
  async destroy(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { id } = input
      const model = await Models.currencies.findByPk(id)
      await model.destroy()

      return ResponseFormatter.success(req, res, next)
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = CurrenciesController
