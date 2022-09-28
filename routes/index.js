'use strict'
// @ts-check

const fs = require('fs')
const path = require('path')
const Route = require('@fizz.js/node-route/libs')
const basename = path.basename(__filename)
const ext = '.js'
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === ext)
  .map(file => file.replace(ext, ''))
  .map(file => Route.register(file, require(path.join(__dirname, file))))

module.exports = Route.router

