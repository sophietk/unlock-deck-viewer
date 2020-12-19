#!/usr/bin/env node

const path = require('path')
const httpServer = require('http-server')

require('../api')

const appRoot = path.join(__dirname, '..', 'app')
const API_PORT = process.env.API_PORT || 3000
const APP_PORT = process.env.APP_PORT || 4000

httpServer.createServer({
  root: appRoot,
  proxy: `http://localhost:${API_PORT}`
}).listen(APP_PORT, () => console.log(`Application available on port ${APP_PORT}`))
