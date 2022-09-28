'use strict'
// @ts-check

require('dotenv').config()
require('./global')

const _ = require('lodash')
const app = require('./app')
const process = require('process')
const cluster = require('cluster')
const config = require('config')
const os = require('os')
const http = require('http')
const Logger = require('@fizz.js/node-logger/libs')
const Common = require('@fizz.js/node-common/libs')
const ServerHandler = require('@fizz.js/node-server-handler/libs')
const ProcessHandler = require('@fizz.js/node-process-handler/libs')
const ClusterHandler = require('@fizz.js/node-cluster-handler/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 * @see https://pm2.io/doc/en/runtime/guide/load-balancing/
 * @see https://postd.cc/setting-up-a-node-js-cluster/
 * @see https://millermedeiros.github.io/mdoc/examples/node_api/doc/cluster.html
 * @class Server
 */
class Server {
  /**
   *Creates an instance of Server.
   * @memberof Server
   */
  constructor() {
    this.instance = undefined
    this.listen()
  }

  /**
   *
   * @description 現在のインスタンスIDを取得する。 `pm2` でクラスタリングしていない場合、常に`0`となる。
   * @readonly
   * @returns {number}
   * @memberof Server
   */
  get id() {
    return _.toNumber(process.env.NODE_APP_INSTANCE || 0)
  }

  /**
   * @deprecated
   * @description 最初のプロセスかどうか判定する。
   * @readonly
   * @returns {boolean}
   * @memberof Server
   */
  get isFirst() {
    return this.id === 0
  }

  /**
   *
   * @description `master`かどうか判定する。
   * @readonly
   * @returns {boolean}
   * @memberof Server
   */
  get isMaster() {
    return cluster.isMaster
  }

  /**
   *
   * @description `worker`かどうか判定する。
   * @readonly
   * @returns {boolean}
   * @memberof Server
   */
  get isWorker() {
    return cluster.isWorker
  }

  /**
   *
   * @readonly
   * @returns {number}
   * @memberof Server
   */
  get port() {
    return config.http.port
  }

  /**
   * @description プロセスを開始して、 `worker` と `master`で仕事を分担する。
   * @returns {void}
   * @memberof Server
   */
  listen() {
    if (this.isMaster) {
      this.startupClusters()
      this.subscribeClusterEvent()
    } else {
      this.startupServer()
    }

    this.subscribeProcessEvent()
  }

  /**
   *
   * @description `http.Server`を起動する。この中身が `Express`で実装された、WEBアプリケーションとなる。
   * @returns {http.Server}
   * @memberof Server
   */
  startupServer() {
    Logger.info(`APP LISTENING AT ${this.port} PROCESS: ${this.id} PID ${process.pid} ENV: ${app.get('env')} `)

    this.instance = http
      .createServer(app)
      .on('listening', ServerHandler.onListening.bind(ServerHandler))
      .on('error', ServerHandler.onError.bind(ServerHandler))
      .listen(this.port)

    return this.instance
  }

  /**
   *
   * @description `process`に対してイベントハンドラを設定する。
   * @returns {NodeJS.Process}
   * @memberof Server
   */
  subscribeProcessEvent() {
    return ProcessHandler.bindServer(this.instance).registerHandler()
  }

  /**
   *
   * @description プロセッサの数だけ`cluster`を起動する。
   * @returns {Array<import('cluster').Worker>}
   * @memberof Server
   */
  startupClusters() {
    const processors = os.cpus().length || 1
    const servers = Common.arrayFromNumber(processors)
    servers.map(() => this.forgeCluster().send(CONSTANT.MSG.PROCESS.CLUSTER_IS_READY))

    return cluster.workers
  }

  /**
   * @description `cluster`を起動する。戻り値は `cluster.Worker` インスタンスである。
   * @returns {import('cluster').Worker}
   * @memberof Server
   */
  forgeCluster() {
    return cluster.fork().on('message', ClusterHandler.onMessage.bind(ClusterHandler))
  }

  /**
   * @description 全`cluster`共通のイベントハンドラを設定する。
   *
   * @returns {import('cluster').Cluster}
   * @memberof Server
   */
  subscribeClusterEvent() {
    return ClusterHandler.registerHandler()
  }
}

module.exports = new Server()
