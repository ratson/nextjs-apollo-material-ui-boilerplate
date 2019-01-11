import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'

let apolloClient = null

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: process.browser
      ? new HttpLink({
          uri: '/graphql',
          credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
        })
      : require('../server/apollo-link').default,
    cache: new InMemoryCache().restore(initialState || {}),
  })
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
