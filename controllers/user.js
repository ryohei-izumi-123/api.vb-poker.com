'use strict'
// @ts-check

const _ = require('lodash')
const moment = require('moment-timezone')
const { Validated, ValidationResult, ValidateSchemaId } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const Common = require('@fizz.js/node-common/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const Models = require('../models')

/**
 *
 *
 * @class UsersController
 */
class UsersController {
  /**
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof UsersController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'password':
        return _.flatten([ValidateSchemaId(), Models.users.getValidator('password')])

      default:
        return Models.users.getValidators(method)
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
   * @memberof UsersController
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
      const where = {
        id: {
          [Models.op.ne]: _.get(req, 'user.id')
        },
        role: Models.users.whereByRole(_.get(req, 'user'))
      }
      const search = Common.fromJSON(input.search || '{}')
      const query = _.toLower(`${search.query || ''}`)
      if (!_.isEmpty(query)) {
        where[Models.op.or] = Models.whereFieldsLike(['username', 'firstName', 'lastName', 'phone', 'email'], query)
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
        order: [[sort, order]],
        include: [
          {
            model: Models.countries,
            required: true
          }
        ]
      }

      const { count = 0 } = await Models.users.findAndCountAll(condition)
      const total = _.toNumber(count || 0)
      const limit = _.toNumber(input.limit || 10)
      const page = _.toNumber(input.page || 1)
      const pages = _.ceil(total / limit)
      const offset = limit * (page - 1) || 0

      condition.limit = limit
      condition.offset = offset

      /** @type {Array<ModelUsers>} */
      const result = await Models.users.findAll(condition)
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
   * @memberof UsersController
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
      const condition = {
        where,
        include: [
          {
            model: Models.countries,
            required: true
          }
        ]
      }

      /** @type {ModelUsers} */
      const { dataValues } = await Models.users.findOne(condition)

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
   * @memberof UsersController
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

      const {
        role,
        username,
        password,
        firstName,
        lastName,
        phone,
        email,
        countryId,
        status = CONSTANT.STATUS.ACTIVE
      } = input
      const createdId = _.get(req, 'user.id')
      const updatedId = _.get(req, 'user.id')
      const fingerPrint = Common.getFingerPrint(req)
      const ipAddress = Common.getRemoteAddress(req)
      const userAgent = Common.getUserAgent(req)
      const failedLoginAttempt = 0
      const payload = {
        role,
        username,
        password,
        firstName,
        lastName,
        phone,
        email,
        countryId,
        status,
        createdId,
        updatedId,
        userAgent,
        fingerPrint,
        ipAddress,
        failedLoginAttempt,
        config: {}
      }

      /** @type {ModelUsers} */
      const model = await Models.users.create(payload, options)
      const { id = undefined } = model

      await tx.commit()
      tx = null

      const { dataValues } = await Models.users.findByPk(id, {
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
   * @memberof UsersController
   */
  async update(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const payload = _.assign(_.cloneDeep(input), {})
      _.set(payload, 'updatedId', _.get(req, 'user.id'))

      const changePassword = _.get(req, 'body.changePassword')
      if (!changePassword) {
        _.unset(payload, 'password')
      }

      const { dataValues } = await Models.users.updateUser(payload)

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
   * @memberof UsersController
   */
  async destroy(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { id } = input
      const model = await Models.users.findByPk(id)
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
   * @memberof UsersController
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
      const model = await Models.users.findByPk(id, options)
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
   * @memberof UsersController
   */
  async password(req, res, next) {
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

      const { id, password } = input
      const updatedId = _.get(req, 'user.id')
      const model = await Models.users.findByPk(id, options)
      const payload = {
        password,
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
}

module.exports = UsersController
