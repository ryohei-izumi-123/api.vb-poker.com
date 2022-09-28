'use strict'
// @ts-check

const MongoDB = require('@fizz.js/node-mongodb/libs')
const { STATUS } = require('@fizz.js/node-constant/libs')
const definition = {
  uuid: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: true,
    lowercase: false,
    uppercase: false,
    default: 'N/A',
    select: true
  },
  ip: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: true,
    lowercase: false,
    uppercase: false,
    default: '127.0.0.1',
    select: true
  },
  userAgent: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: false,
    lowercase: false,
    uppercase: false,
    default: 'N/A',
    select: true
  },
  fingerPrint: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: true,
    lowercase: false,
    uppercase: false,
    default: 'N/A',
    select: true
  },
  userLanguage: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: false,
    lowercase: false,
    uppercase: false,
    default: 'N/A',
    select: true
  },
  referer: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: false,
    lowercase: false,
    uppercase: false,
    default: 'N/A',
    select: true
  },
  uri: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: true,
    lowercase: false,
    uppercase: false,
    default: 'N/A',
    select: true
  },
  scope: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    enum: {
      values: [ADMIN, PLAYER, ANY]
    },
    default: ANY,
    trim: true,
    lowercase: true,
    uppercase: false,
    select: true
  },
  status: {
    required: true,
    unique: false,
    type: String,
    enum: {
      values: [STATUS.ACTIVE, STATUS.INCTIVE, STATUS.PENDING]
    },
    default: STATUS.PENDING,
    trim: true,
    lowercase: true,
    uppercase: false,
    select: true
  }
}

const schema = MongoDB.createSchema(definition)
module.exports = schema
