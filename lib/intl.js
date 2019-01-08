import React from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'

const IntlContext = React.createContext()
addLocaleData([...en, ...zh])

export const defaultLocale = 'en'

export const loadMessages = async locale => {
  const { default: messages } = await import(`app/lang/${locale}.json`)
  return messages
}

class StatefulIntlProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...props,
      switchToLocale: this.switchToLocale,
    }
  }

  switchToLocale = async locale => {
    this.setState({ locale, messages: await loadMessages(locale) })
  }

  render() {
    const { children } = this.props
    const { locale, messages, initialNow } = this.state
    return (
      <IntlContext.Provider value={this.state}>
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages}
          defaultLocale={defaultLocale}
          initialNow={initialNow}
          textComponent={React.Fragment}>
          {children}
        </IntlProvider>
      </IntlContext.Provider>
    )
  }
}

export const IntlConsumer = IntlContext.Consumer
export { StatefulIntlProvider as IntlProvider }
