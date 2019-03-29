#!/usr/bin/env node
'use strict'
const cac = require('cac')
const main = require('./')

const cli = cac()

cli.command('*', 'Scaffold a new project', (input, flags) => {
    main(input, flags)
})

cli.parse()
