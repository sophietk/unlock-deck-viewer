#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const httpServer = require('http-server')

function someParseInt (value, dummyPrevious) {
  return parseInt(value, 10)
}

program
  .description('Tiny app to load and play an Unlock adventure deck')
  .option('-p, --app-port <number>', 'set app port', someParseInt, 4000)
  .option('-i, --api-port <number>', 'set api port', someParseInt, 3000)
  .parse(process.argv)

const { appPort, apiPort } = program

process.env.API_PORT = apiPort
require('../api')

httpServer.createServer({
  root: path.join(__dirname, '..', 'app'),
  proxy: `http://localhost:${apiPort}`
}).listen(appPort, () => console.log(`Application available on port ${appPort}, please go to http://localhost:${appPort}`))
