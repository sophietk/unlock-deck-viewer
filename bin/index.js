#!/usr/bin/env node

import { program } from 'commander'
import { join } from 'path'
import { createServer } from 'http-server'
import { apiPort } from '../api/index.js'

function someParseInt (value, dummyPrevious) {
  return parseInt(value, 10)
}

program
  .description('Tiny app to load and play an Unlock adventure deck')
  .option('-p, --app-port <number>', 'set app port', someParseInt, 4000)
  .parse(process.argv)

const { appPort } = program.opts()

createServer({
  root: join(import.meta.dirname, '..', 'app'),
  proxy: `http://localhost:${apiPort}`
}).listen(appPort, () => console.log(`Application available on port ${appPort}, please go to http://localhost:${appPort}`))
