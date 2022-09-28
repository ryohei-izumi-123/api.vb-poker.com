'use strict'

const base = {
  watch: true,
  shutdown_with_message: true,
  ignore_watch: ['.git', 'node_modules', 'docs', 'logs', 'coverage', 'assets', '*/.node-xmlhttprequest-sync*'],
  watch_options: {
    followSymlinks: false,
    usePolling: true
  },
  listen_timeout: 5000,
  kill_timeout: 5000,
  source_map_support: true,
  max_memory_restart: '2G',
  log_date_format: 'YYYY-MM-DD HH:mm Z',
  node_args:
    '--expose-gc --always-compact --optimize-for-size --max-old-space-size=2048 --gc-interval=10000 --stack-size=64000',
  env: {
    NODE_ENV: 'development'
  },
  env_production: {
    NODE_ENV: 'production'
  }
}
const clone = src => Object.assign(Object.assign({}, base), src)
const api = clone({
  name: 'backend-api',
  script: 'index.js',
  exec_mode: 'cluster',
  instances: 4
})
const worker = clone({
  name: 'backend-worker',
  script: './workers/index.js',
  exec_mode: 'fork',
  instances: 1
})
const options = {
  /**
   * @description Application configuration section
   * @see https://pm2.io/doc/en/runtime/guide/ecosystem-file/
   * @see http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [api, worker],

  /**
   * @description Deployment section
   * @see http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'api.vb-poker.com',
      host: 'api.vb-poker.com',
      ref: 'origin/master',
      repo: 'https://github.com/fizzjs/api.vb-poker.com.git',
      ssh_options: 'StrictHostKeyChecking=no',
      path: '/var/www/api.vb-poker.com',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev: {
      user: 'api.vb-poker.com',
      host: 'api.vb-poker.com',
      ref: 'origin/master',
      repo: 'https://github.com/fizzjs/api.vb-poker.com.git',
      ssh_options: ['PasswordAuthentication=no', 'StrictHostKeyChecking=no'],
      path: '/var/www/api.vb-poker.com',
      // 'pre-setup' : 'yum -y install git',
      'post-setup': 'ls -la',
      'pre-deploy-local': 'echo \'This is a local executed command\'',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev'
      }
    }
  }
}

module.exports = options
