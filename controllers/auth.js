'use strict'
// @ts-check

const _ = require('lodash')
const { Validate, Validated, ValidationResult } = require('@fizz.js/node-validate/libs')
const GoogleAuthenticator = require('@fizz.js/node-google-authenticator/libs')
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')
const { ValidationError } = require('@fizz.js/node-errors/libs')
const Models = require('../models')

/**
 *
 *
 * @class AuthController
 */
class AuthController {
  /**
   *
   *
   * @param {string} [method='']
   * @returns {import('express').RequestHandler[]}
   * @memberof AuthController
   */
  validationMiddleware(method = '') {
    switch (method) {
      case 'totp':
        return [
          Models.users.getValidator('username'),
          Models.users.getValidator('password'),
          Validate('token')
            .isLength({
              min: 4,
              max: 6
            })
            .isHalfWidth()
            .exists({
              checkNull: true,
              checkFalsy: true
            })
            .matches(/^[0-9]{4,6}/, 'g')
            .trim()
        ]

      case 'login':
        return [Models.users.getValidator('username'), Models.users.getValidator('password')]

      case 'update':
        return [
          Models.users.getValidator('password'),
          Models.users.getValidator('firstName'),
          Models.users.getValidator('lastName'),
          Models.users.getValidator('phone'),
          Models.users.getValidator('email'),
          Models.users.getValidator('countryId')
        ]

      case 'qr':
        break

      case 'security':
        return [
          Validate('token')
            .isLength({
              min: 4,
              max: 6
            })
            .isHalfWidth()
            .exists({
              checkNull: true,
              checkFalsy: true
            })
            .matches(/^[0-9]{4,6}/, 'g')
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
   * @returns {*}
   *
   * @memberof AuthController
   */
  async login(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      let accessToken, refreshToken, expiredAt
      const { username, password } = input
      const user = await Models.users.authenticate(username, password)
      const { id } = user
      const method = _.get(user, 'config.security.method')
      if (_.isEmpty(method)) {
        const session = await Models.userSessions.createToken(id)
        accessToken = _.get(session, 'accessToken')
        refreshToken = _.get(session, 'refreshToken')
        expiredAt = _.get(session, 'expiredAt')
      }

      return ResponseFormatter.success(req, res, next, {
        id,
        username,
        accessToken,
        refreshToken,
        expiredAt,
        method
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
   * @returns {*}
   *
   * @memberof AuthController
   */
  async fetch(req, res, next) {
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const result = await Models.users.getByUserId(_.get(req, 'user.id'))
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
   * @memberof AuthController
   */
  async logout(req, res, next) {
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      await Models.userSessions.flushTokens(_.get(req, 'user.id'))
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
   * @returns {*}
   *
   * @memberof AuthController
   */
  async totp(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { username, password, token } = input
      const user = await Models.users.authenticate(username, password)
      const { id, mfaKey } = user

      // const method = await Models.users.getSecurityMethodFromConfig(id)
      const method = _.get(user, 'config.security.method')
      const verified = GoogleAuthenticator.verify(mfaKey, token)
      if (!verified) {
        throw new ValidationError(CONSTANT.ERROR.VALIDATION)
      }

      const session = await Models.userSessions.createToken(id)
      const { accessToken, refreshToken, expiredAt } = session

      return ResponseFormatter.success(req, res, next, {
        id,
        username,
        accessToken,
        refreshToken,
        expiredAt,
        method
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
   * @returns {*}
   *
   * @memberof AuthController
   */
  async security(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const { token } = input
      const id = _.get(req, 'user.id')
      const user = await Models.users.getByUserId(id)
      const { mfaKey } = user
      const method = 'google'
      const security = {
        method
      }

      const verified = GoogleAuthenticator.verify(mfaKey, token)
      if (!verified) {
        throw new ValidationError(CONSTANT.ERROR.VALIDATION)
      }

      const current = _.get(user, 'config.security.method')
      const enable = current === method
      if (enable) {
        _.unset(security, 'method')
      }

      await Models.users.setSecurityConfig(id, security)
      const result = !enable

      return ResponseFormatter.success(req, res, next, {
        result
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
   * @returns {*}
   *
   * @memberof AuthController
   */
  async qr(req, res, next) {
    try {
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const id = _.get(req, 'user.id')
      const user = await Models.users.getByUserId(id)
      const { username } = user
      const seed = GoogleAuthenticator.generate(username)
      const { ascii, base32 } = seed
      const qr = await GoogleAuthenticator.createQRCode(username, ascii)
      const payload = {}
      _.set(payload, 'id', id)
      _.set(payload, 'updatedId', id)
      _.set(payload, 'mfaKey', base32)

      await Models.users.updateUser(payload)

      return ResponseFormatter.success(req, res, next, {
        qr
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
   * @memberof AuthController
   */
  async update(req, res, next) {
    try {
      const input = Validated(req)
      const errors = ValidationResult(req)
      if (!errors.isEmpty()) {
        return errors.throw()
      }

      const id = _.get(req, 'user.id')
      const payload = _.assign(_.cloneDeep(input), {})
      _.set(payload, 'id', id)
      _.set(payload, 'updatedId', id)
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
}

module.exports = AuthController
