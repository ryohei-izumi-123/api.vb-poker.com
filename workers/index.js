'use strict'
// @ts-check

require('dotenv').config()
require('../global')

const process = require('process')
const ChildProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const inflector = require('inflected')
const ProcessHandler = require('@fizz.js/node-process-handler/libs')
const Logger = require('@fizz.js/node-logger/libs')
const { FatalError, ConfigError } = require('@fizz.js/node-errors/libs')

/**
 *
 * @class WorkerProcess
 */
class WorkerProcess {
  /**
   * Creates an instance of WorkerProcess.
   * @memberof WorkerProcess
   */
  constructor() {
    if (!process.env.APP_ENV) {
      throw new ConfigError('Environment variables not defined!')
    }

    this.workers = new Map()
    this.initWorkers()
    this.subscribeProcessEvent()

    return new Proxy(this, {
      get: (target, name, receiver) => {
        if (name in target) {
          return target[name]
        }

        if (this.workers.has(name)) {
          return this.workers.get(name)
        }

        return Reflect.get(target, name, receiver)
      }
    })
  }

  /**
   *
   *
   * @param {string} modulePath
   * @returns {import('child_process').ChildProcess}
   * @memberof WorkerProcess
   */
  getChildProcess(modulePath) {
    try {
      if (!fs.existsSync(modulePath)) {
        throw new FatalError(
          `Module path is invalid! ${modulePath}. please specify a correct path like "path.resolve('workers', 'index.js')"`
        )
      }

      return ChildProcess.fork(modulePath)
    } catch (error) {
      Logger.error(error)
      throw error
    }
  }

  /**
   *
   * @returns {NodeJS.Process}
   * @memberof WorkerProcess
   */
  subscribeProcessEvent() {
    return ProcessHandler.registerHandler()
  }

  /**
   *
   * @returns {void}
   * @memberof WorkerProcess
   */
  initWorkers() {
    const basename = path.basename(__filename)
    const ext = '.js'
    fs.readdirSync(__dirname)
      .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === ext)
      .map(file => file.replace(ext, ''))
      .map(file => {
        const clazz = inflector.classify(inflector.camelize(inflector.underscore(file)))
        const Worker = require(`./${file}`)
        const instance = new Worker()
        this.workers.set(clazz, instance)
      })

    Logger.debug('[DEBUG] all workers has been launched...')
  }
}

module.exports = new WorkerProcess()
