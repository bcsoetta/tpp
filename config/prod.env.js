'use strict'

var dotenv = require('dotenv').config({
  path: './.env.production'
})

console.log("In prod.env...")
console.log(dotenv.parsed)

module.exports = {
  NODE_ENV: '"production"',
  ...dotenv.parsed
}
