'use strict'
// @ts-check

const _ = require('lodash')
const moment = require('moment-timezone')
const Ajv = require('ajv')
const FileClient = require('@fizz.js/node-file-client/libs')
const Acl = require('@fizz.js/node-acl-v3/libs')
const { Validated, ValidationResult, ValidateSchema } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const Logger = require('@fizz.js/node-logger/libs')
const Common = require('@fizz.js/node-common/libs')
const { ValidationError } = require('@fizz.js/node-errors/libs')
const Models = require('../models')

/**
 *
 *
 * @class AclsController
 */
class AclsController {
  /**
   * Creates an instance of AclsController.
   * @memberof AclsController
   */
  constructor() {
    this._ajv = new Ajv()
    this._client = new FileClient()
    this._init()
  }

  /**
   *
   *
   * @memberof AclsController
   */
  async _init() {
    const encoding = 'utf-8'
    const options = { encoding }
    const filename = `${process.cwd()}/assets/schema/acl.json`
    const payload = { filename }
    const json = await this._client.read(payload, options)
    this._ajv.addSchema(Common.fromJSON(json), 'acl')
  }

  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof AclsController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'updateAll':
        return []

      case 'getAll':
        return Models.acls.getValidators(method)

      case 'getOne':
        return [
          ValidateSchema({
            role: {
              in: ['params', 'query'],
              isIn: [['administrator', 'manager', 'operator', 'head_office', 'master_agent', 'agent', 'na']]
            }
          })
        ]
    }

    return Models.acls.getValidators(method)
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns
   *
   * @memberof AclsController
   */
  async getAll(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const sort = input.sort || 'id'
      const order = _.toUpper(`${input.order || 'ASC'}`)
      const filters = Common.fromJSON(input.filters || '{}')
      const where = {}
      const search = Common.fromJSON(input.search || '{}')
      const query = _.toLower(`${search.query || ''}`)
      if (!_.isEmpty(query)) {
        where[Models.op.or] = Models.whereFieldsLike(['role'], query)
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

      const { count = 0 } = await Models.acls.findAndCountAll(condition)
      const total = _.toNumber(count || 0)
      const limit = _.toNumber(input.limit || 10)
      const page = _.toNumber(input.page || 1)
      const pages = _.ceil(total / limit)
      const offset = limit * (page - 1) || 0

      condition.limit = limit
      condition.offset = offset

      /** @type {Array<ModelAcls>} */
      const result = await Models.acls.findAll(condition)
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
   * @memberof AclsController
   */
  async getOne(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { role } = input
      const where = {
        role
      }

      /** @type {ModelAcls} */
      const { dataValues } = await Models.acls.findOne({
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
   * @memberof AclsController
   */
  async updateAll(req, res, next) {
    let tx
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      tx = await Models.startTransaction()
      const options = {
        transaction: tx,
        lock: tx.LOCK.UPDATE
      }

      const userId = _.get(req, 'user.id')
      const updatedId = userId
      const rows = _.toArray(req.body)
      for (const row of rows) {
        _.set(row, 'updatedId', updatedId)
        if (!this._ajv.validate('acl', _.get(row, 'permissions'))) {
          throw new ValidationError(this._ajv.errorsText())
        }

        const model = await Models.acls.findByPk(row.id, options)
        await model.update(row, options)
      }

      await tx.commit()
      tx = null

      const sort = 'id'
      const order = 'ASC'
      const condition = {
        useMaster: true,
        order: [[sort, order]]
      }

      /** @type {Array<ModelAcls>} */
      const result = await Models.acls.findAll(condition)
      Acl.configure(Models.acls.mapAsArray(result))
      Logger.info(Acl.builder.getGrants())

      return ResponseFormatter.success(req, res, next, result)
    } catch (error) {
      if (tx) {
        await tx.rollback()
      }

      return ResponseFormatter.raiseError(error, req, res, next)
    } finally {
      await Models.endTransaction()
    }
  }
}

module.exports = AclsController
