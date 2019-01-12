import Koa from 'koa'
import next from 'next'
import Router from 'koa-router'
import { ApolloServer } from 'apollo-server-koa'
import compression from 'compression'
import koaConnect from 'koa-connect'

import schema from './schema'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const graphQLServer = new ApolloServer({
  schema,
  // Make graphql playgroud available at /graphql
  playground: {
    endpoint: '/graphql',
  },
  bodyParser: true,
})

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.use(koaConnect(compression()))

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
