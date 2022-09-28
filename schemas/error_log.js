'use strict'
// @ts-check

const MongoDB = require('@fizz.js/node-mongodb/libs')
const { STATUS } = require('@fizz.js/node-constant/libs')
const definition = {
  message: {
    required: true,
    unique: false,
    type: MongoDB.types.String,
    trim: false,
    lowercase: false,
    uppercase: false,
    default: '',
    select: true
  },
  stack: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: false,
    lowercase: false,
    uppercase: false,
    default: '',
    select: true
  },
  trace: {
    required: false,
    unique: false,
    type: MongoDB.types.String,
    trim: false,
    lowercase: false,
    uppercase: false,
    default: '',
    select: true
  },
  status: {
    required: true,
    unique: false,
    type: MongoDB.types.String,
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
