'use strict'
// @ts-check

const fs = require('fs')
const path = require('path')
const Controller = require('@fizz.js/node-controller/libs')
const basename = path.basename(__filename)
const ext = '.js'
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === ext)
  .map(file => file.replace(ext, ''))
  .map(file => Controller.register(file, require(`./${file}`)))

module.exports = Controller.controllers
