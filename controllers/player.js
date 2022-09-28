'use strict'
// @ts-check

const _ = require('lodash')
const moment = require('moment-timezone')
const { Validate, Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const Common = require('@fizz.js/node-common/libs')
const Models = require('../models')

/**
 *
 *
 * @class PlayersController
 */
class PlayersController {
  /**
   *
   * @param {string} [method='']
   * @returns {express.Middleware[]}
   * @memberof PlayersController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'auth':
        return [
          Models.users.getValidator('name'),
          Models.users.getValidator('photo'),
          Validate('id')
            .isLength({
              max: 128
            })
            .exists({
              checkNull: true,
              checkFalsy: true
            })
            .trim()
        ]

      default:
        return Models.players.getValidators(method)
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
   * @memberof PlayersController
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

      const { count = 0 } = await Models.players.findAndCountAll(condition)
      const total = _.toNumber(count || 0)
      const limit = _.toNumber(input.limit || 10)
      const page = _.toNumber(input.page || 1)
      const pages = _.ceil(total / limit)
      const offset = limit * (page - 1) || 0

      condition.limit = limit
      condition.offset = offset

      /** @type {Array<ModelPlayers>} */
      const result = await Models.players.findAll(condition)
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
   * @memberof PlayersController
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

      /** @type {ModelPlayers} */
      const { dataValues } = await Models.players.findOne({
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
   * @memberof PlayersController
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

      const { status } = input
      const userId = _.get(req, 'user.id')
      const createdId = userId
      const updatedId = userId
      const payload = {
        status,
        createdId,
        updatedId
      }

      /** @type {ModelPlayers} */
      const model = await Models.players.create(payload, options)
      const { id = undefined } = model

      await tx.commit()
      tx = null

      const { dataValues } = await Models.players.findByPk(id, {
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
   * @memberof PlayersController
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

      const { id, status } = input
      const userId = _.get(req, 'user.id')
      const updatedId = userId
      const model = await Models.players.findByPk(id, options)
      const { dataValues } = await model.update(
        {
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
   * @memberof PlayersController
   */
  async destroy(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { id } = input
      const model = await Models.players.findByPk(id)
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
   * @memberof PlayersController
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
      const model = await Models.players.findByPk(id, options)
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
   * @returns {*}
   *
   * @memberof PlayersController
   */
  async auth(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { name, photo } = input
      const status = CONSTANT.STATUS.ACTIVE
      const externalId = _.get(input, 'id')
      const rank = 'silver'
      const fingerPrint = Common.getFingerPrint(req)
      const ipAddress = Common.getRemoteAddress(req)
      const userAgent = Common.getUserAgent(req)
      const failedLoginAttempt = 0
      const balance = 0
      const userId = 0
      const createdId = userId
      const updatedId = userId
      const payload = {
        name,
        photo,
        rank,
        externalId,
        balance,
        userAgent,
        fingerPrint,
        ipAddress,
        failedLoginAttempt,
        config: {},
        status,
        createdId,
        updatedId
      }

      /** @type {ModelPlayers} */
      const model = await Models.players.findOrCreatePlayer(payload)
      const { id, dataValues } = model

      const session = await Models.playerSessions.createToken(id)
      const accessToken = _.get(session, 'accessToken')
      const refreshToken = _.get(session, 'refreshToken')
      const expiredAt = _.get(session, 'expiredAt')

      return ResponseFormatter.success(
        req,
        res,
        next,
        _.assign(_.cloneDeep(dataValues), {
          accessToken,
          refreshToken,
          expiredAt
        })
      )
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
   * @returns {*}
   *
   * @memberof PlayersController
   */
  async getPlayerAuth(req, res, next) {
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      console.log(req.user)
      const result = await Models.players.getByPlayerId(_.get(req, 'user.id'))
      return ResponseFormatter.success(req, res, next, result)
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
   * @returns {*}
   *
   * @memberof PlayersController
   */
  async logoutPlayer(req, res, next) {
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      await Models.playerSessions.flushTokens(_.get(req, 'user.id'))
      return ResponseFormatter.success(req, res, next)
    } catch (error) {
      return ResponseFormatter.raiseError(error, req, res, next)
    }
  }
}

module.exports = PlayersController
