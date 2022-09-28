'use strict'
// @ts-check

global.noop = () => {}
if (!global.gc) {
  global.gc = () => {}
}

if (!global.XMLHttpRequest) {
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
}
