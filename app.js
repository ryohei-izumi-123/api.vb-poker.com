'use strict'
// @ts-check

// const _ = require('lodash')
const express = require('express')
const app = express()
const config = require('config')
const Logger = require('@fizz.js/node-logger/libs')
const SentryMiddleware = require('@fizz.js/node-sentry-middleware/libs')
const Sentry = new SentryMiddleware(app)
const ResponseFormatter = require('@fizz.js/node-response-formatter/libs')
const RequestLogger = require('@fizz.js/node-request-logger/libs')
const Authenticate = require('@fizz.js/node-authenticate/libs')
const StaticServer = require('@fizz.js/node-static-server/libs')
const Security = require('@fizz.js/node-security/libs')
const Context = require('@fizz.js/node-context/libs')
const Acl = require('@fizz.js/node-acl-v3/libs')
const ProcessHandler = require('@fizz.js/node-process-handler/libs')
const Models = require('./models')
const Route = require('./routes')

const disableXPoweredBy = () => app.disable('x-powered-by')
const setupProxy = () => {
  app.enable('trust proxy')
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
}
const setupView = () => {
  app.set('views', `${__dirname}/${config.view.dir}`)
  app.set('view options', config.view.options)
  app.set('view engine', config.view.engine)
}
const setupRoutes = () => app.use(config.endpoint.version, Route)
const setupAcl = async () => Acl.configure(await Models.acls.getAclAsArray())
const setupMiddleware = () => {
  Authenticate.registerDriver('getByUserId', Models.users.getByUserId.bind(Models.users))
  Authenticate.registerDriver('getByPlayerId', Models.players.getByPlayerId.bind(Models.players))
  app.use('/assets', StaticServer.get())
  app.use(Sentry.configureRequestHandler())
  app.use(Security)
  app.use(Context.create.bind(Context))
  app.use(RequestLogger)
  app.use(Logger.getLog4jsMiddleware())
  app.use(Authenticate.configure.bind(Authenticate))
  app.use(Authenticate.initialize.bind(Authenticate))
  app.use(Authenticate.useSession.bind(Authenticate))
}
const setupErrorMiddleware = () => {
  app.use(Sentry.configureErrorHandler())
  app.use(ResponseFormatter.notFound.bind(ResponseFormatter))
  app.use(ResponseFormatter.catchErrors.bind(ResponseFormatter))
}
const setupExpress = async () => {
  disableXPoweredBy()
  setupProxy()
  setupView()
  await setupAcl()
  setupMiddleware()
  setupRoutes()
  setupErrorMiddleware()
  Logger.debug('[DEBUG] api has been launched...')
}
const setupShutdownHandler = async () => {
  ProcessHandler.addShutdownListener('Models', async () => await Models.closeConnection().catch(() => Logger.noop()))
}

setupExpress()
setupShutdownHandler()

module.exports = app
