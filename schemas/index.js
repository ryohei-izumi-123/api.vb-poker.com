'use strict'
// @ts-check

const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const ext = '.js'
const MongoDB = require('@fizz.js/node-mongodb/libs')
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === ext)
  .map(file => file.replace(ext, ''))
  .map(file => {
    const schema = require(path.join(__dirname, file))
    MongoDB.setSchema(file, schema)
  })

module.exports = MongoDB
