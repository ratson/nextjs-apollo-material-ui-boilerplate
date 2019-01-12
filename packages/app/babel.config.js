'use strict'

module.exports = api => {
  api.cache(true)

  const presets = ['next/babel']

  return {
    presets,
    env: {
      development: {
        plugins: ['react-intl'],
      },
      production: {
        plugins: [
          [
            'react-intl',
            {
              messagesDir: 'lang/.messages/',
            },
          ],
        ],
      },
    },
  }
}
