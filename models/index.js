'use strict'
// @ts-check

const fs = require('fs')
const path = require('path')
const { Model } = require('@fizz.js/node-model/libs')
const Models = new Model(true)
const basename = path.basename(__filename)
const ext = '.js'
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === ext)
  .map(file => file.replace(ext, ''))
  .map(file => Models.registerTable(file, require(`./${file}`)))

Models.associateTables()
Models.sync()
module.exports = Models
