'use strict'

module.exports = {
  webpack(config, options) {
    config.resolve.alias['app'] = __dirname
    return config
  },
}
