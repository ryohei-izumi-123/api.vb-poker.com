'use strict'
// @ts-check

const _ = require('lodash')
const config = require('config')
const { Server } = require('socket.io')
const BaseWorker = require('@fizz.js/node-worker/libs')
const Logger = require('@fizz.js/node-logger/libs')
const Jwt = require('@fizz.js/node-jwt/libs')
const Redis = require('@fizz.js/node-redis/libs')
const { createAdapter } = require('@socket.io/redis-adapter')
// const CONSTANT = require('@fizz.js/node-constant/libs')
const Models = require('../models')

/**
 *
 * @description test
 * @extends {BaseWorker}
 * @class SocketWorker
 */
class SocketWorker extends BaseWorker {
  /**
   * Creates an instance of SocketWorker.
   * @constructor
   * @memberOf SocketWorker
   */
  constructor() {
    super()
    this.users = new Map()
    this.init()
  }

  /**
   *
   *
   * @return {import('@socket.io/redis-adapter').RedisAdapter}
   * @memberof SocketWorker
   */
  getRedisAdapter() {
    const { client } = Redis
    const pubClient = client
    const subClient = client.duplicate()

    return createAdapter(pubClient, subClient)
  }

  /**
   *
   *
   * @returns {void}
   * @memberof SocketWorker
   */
  async init() {
    this.users.clear()
    this.io = new Server(config.socket.port, config.socket.options)
      .adapter(this.getRedisAdapter())
      .use(this.authenticate.bind(this))
      .on('connection', this.onConnection.bind(this))
  }

  /**
   *
   *
   * @param {import('socket.io').Socket} socket
   * @memberof SocketWorker
   */
  async onConnection(socket) {
    Logger.info('[Socket] connected')
    socket.on('disconnect', reason => this.onDisconnect(socket, reason)).on('error', err => this.onError(socket, err))
  }

  /**
   *
   *
   * @param {import('socket.io').Socket} socket
   * @param {string} reason
   * @memberof SocketWorker
   */
  async onDisconnect(socket, reason) {
    Logger.warn(`[Socket] Disconnected: ${reason}`)
    const id = _.get(socket, 'user.id')
    if (this.users.has(id)) {
      this.users.delete(id)
    }

    delete socket.user
  }

  /**
   *
   *
   * @param {import('socket.io').Socket} socket
   * @param {Error} error
   * @memberof SocketWorker
   */
  async onError(socket, error) {
    Logger.error('[Socket] Error:', error)
  }

  /**
   *
   *
   * @param {import('socket.io').Socket} socket
   * @param {*} next
   * @return {*}
   * @memberof SocketWorker
   */
  async authenticate(socket, next) {
    try {
      const token = _.get(socket, 'handshake.auth.token')
      if (token) {
        const { id } = await Jwt.verify(token)
        const user = await Models.users.getByUserId(id)
        if (user) {
          if (this.users.has(user.id)) {
            this.users.delete(user.id)
          }

          this.users.set(user.id, user)
          socket.user = user
          Logger.info(`[Socket] User: ${user.username}`)
        }
      }

      return next()
    } catch (error) {
      Logger.error(error)
      return next(error)
    }
  }

  /**
   *
   *
   * @memberof SocketWorker
   */
  run() {
    this.tasks.set('0 10 * * * *', () => {})
  }
}

module.exports = SocketWorker
