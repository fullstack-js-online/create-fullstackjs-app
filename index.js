#!/usr/bin/env node

const sao = require('sao')
const path = require('path')
const chalk = require('chalk')

const generator = path.resolve(__dirname, './')

// In a custom directory or current directory and defaults to
// installing into current directory.
const outDir = path.resolve(process.argv[2] || '.')

console.log(`
  > ${chalk.blue(
      `Generating fullstack javascript project in ${
          process.argv[2] ? `./${process.argv[2]}` : 'current directory'
      }`
  )}
`)

// See https://saojs.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
    .run()
    .catch(err => {
        console.trace(err)
        process.exit(1)
    })
