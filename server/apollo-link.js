const { SchemaLink } = require('apollo-link-schema')

const schema = require('./schema')

module.exports = new SchemaLink({ schema })
