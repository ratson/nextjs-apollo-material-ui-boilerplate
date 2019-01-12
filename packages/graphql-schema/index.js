import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools'

const typeDefs = gql`
  type Greeting {
    message: String
  }

  type Counter {
    count: Int
  }

  type Query {
    greeting: Greeting
    counter: Counter
  }

  type Mutation {
    increment(step: Int): Counter
  }
`

let count = 0
const resolvers = {
  Query: {
    greeting: () => ({
      message: 'Hello World!',
    }),
    counter: () => ({ count }),
  },
  Mutation: {
    increment(root, args) {
      count += args.step
      return { count }
    },
  },
}

export default makeExecutableSchema({ typeDefs, resolvers })
