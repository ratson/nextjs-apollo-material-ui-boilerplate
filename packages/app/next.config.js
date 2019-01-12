'use strict'
const withTM = require('next-plugin-transpile-modules')

module.exports = withTM({
  transpileModules: ['app', 'graphql-schema'],
  webpack(config, options) {
    return config
  },
})
