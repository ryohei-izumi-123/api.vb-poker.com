'use strict'
// @ts-check

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const fetch = () => {
  const br = '\n'
  let config = {}
  let envStr = ''
  // const root = `${__dirname}/node_modules/@fizz.js/`
  const root = '../'
  const modules = fs
    .readdirSync(root)
    .filter(name => fs.statSync(path.join(root, name)).isDirectory())
    .filter(name => name.startsWith('node-'))
  for (let module of modules) {
    if (fs.statSync(path.join(root, module)).isDirectory()) {
      const configPath = path.join(root, module, '/config/default.json')
      if (fs.existsSync(configPath)) {
        _.merge(config, JSON.parse(fs.readFileSync(configPath)))
      }

      const envPath = path.join(root, module, '/.env')
      if (fs.existsSync(envPath)) {
        envStr += `${br}${fs.readFileSync(envPath, 'utf8')}`
      }
    }
  }

  const envMap = new Map()
  envStr
    .split(br)
    .filter(line => !_.isEmpty(line) && line.includes('='))
    .map(line => {
      const [k, v] = line.split('=')
      envMap.set(k, v)
    })
  let env = ''
  envMap.forEach((v, k) => {
    env += `${k}=${v}${br}`
  })

  fs.writeFileSync(path.join(__dirname, '/.env.example'), env, 'utf8')
  console.log(`[DONE]: ${path.join(__dirname, '/.env.example')}`)
  fs.writeFileSync(path.join(__dirname, '/config/default.example.json'), JSON.stringify(config, null, 4), 'utf8')
  console.log(`[DONE]: ${path.join(__dirname, '/config/default.example.json')}`)
}
fetch()
