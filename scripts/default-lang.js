const { resolve } = require('path')
const fse = require('fs-extra')
const glob = require('glob')

async function main() {
  const defaultMessages = glob
    .sync('./lang/.messages/**/*.json')
    .map(filename => fse.readJSONSync(filename))
    .reduce((messages, descriptors) => {
      descriptors.forEach(({ id, defaultMessage }) => {
        if (messages.hasOwnProperty(id)) {
          throw new Error(`Duplicate message id: ${id}`)
        }
        messages[id] = defaultMessage
      })
      return messages
    }, {})

  await fse.outputJSON('./lang/en.json', defaultMessages, { spaces: 2 })
  console.log(`> Wrote default messages to: "${resolve('./lang/en.json')}"`)
}

main()
