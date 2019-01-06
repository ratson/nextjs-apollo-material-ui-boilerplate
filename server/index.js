'use strict'
const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const { ApolloServer, gql } = require('apollo-server-koa')

const schema = gql`
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

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let count = 0
const graphQLServer = new ApolloServer({
  typeDefs: schema,
  resolvers: {
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
  },

  // Make graphql playgroud available at /graphql
  playground: {
    endpoint: '/graphql',
  },
  bodyParser: true,
})

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  graphQLServer.applyMiddleware({
    app: server,
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
