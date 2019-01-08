import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import { ApolloProvider } from 'react-apollo'

import getPageContext from 'app/src/getPageContext'
import withApolloClient from 'app/lib/with-apollo-client'
import { IntlProvider, defaultLocale, loadMessages } from 'app/lib/intl'

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    const locale = defaultLocale
    const { default: messages } = await loadMessages(locale)
    const initialNow = Date.now()

    return { pageProps, locale, messages, initialNow }
  }

  constructor() {
    super()
    this.pageContext = getPageContext()
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const {
      Component,
      pageProps,
      apolloClient,
      locale,
      messages,
      initialNow,
    } = this.props
    return (
      <Container>
        <IntlProvider
          locale={locale}
          messages={messages}
          initialNow={initialNow}>
          <ApolloProvider client={apolloClient}>
            <Head>
              <title>My page</title>
            </Head>
            {/* Wrap every page in Jss and Theme providers */}
            <JssProvider
              registry={this.pageContext.sheetsRegistry}
              generateClassName={this.pageContext.generateClassName}>
              {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
              <MuiThemeProvider
                theme={this.pageContext.theme}
                sheetsManager={this.pageContext.sheetsManager}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
                <Component pageContext={this.pageContext} {...pageProps} />
              </MuiThemeProvider>
            </JssProvider>
          </ApolloProvider>
        </IntlProvider>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)
