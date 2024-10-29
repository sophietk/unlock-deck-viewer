#!/usr/bin/env node

import { program } from 'commander'
import { join } from 'path'
import { createServer } from 'http-server'

function someParseInt (value, dummyPrevious) {
  return parseInt(value, 10)
}

program
  .description('Tiny app to load and play an Unlock adventure deck')
  .option('-p, --app-port <number>', 'set app port', someParseInt, 4000)
  .option('-i, --api-port <number>', 'set api port', someParseInt, 3000)
  .parse(process.argv)

const { appPort, apiPort } = program.opts()

process.env.API_PORT = apiPort
import '../api/index.js'

createServer({
  root: join(import.meta.dirname, '..', 'app'),
  proxy: `http://localhost:${apiPort}`
}).listen(appPort, () => console.log(`Application available on port ${appPort}, please go to http://localhost:${appPort}`))
