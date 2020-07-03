'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

var dotenv = require('dotenv').config({
  path: './.env'
})

console.log("In development env...")
console.log(dotenv.parsed)

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ...dotenv.parsed
})
