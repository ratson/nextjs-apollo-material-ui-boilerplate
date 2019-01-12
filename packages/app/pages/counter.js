import React from 'react'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

import { IntlConsumer } from 'app/lib/intl'

const GET_COUNTER = gql`
  {
    counter {
      count
    }
  }
`

const INCREMENT_COUNTER = gql`
  mutation Increment($step: Int!) {
    increment(step: $step) {
      count
    }
  }
`

const IncrementButton = ({ children }) => (
  <Mutation
    mutation={INCREMENT_COUNTER}
    variables={{ step: children === 0 ? 1 : children + 1 }}
    refetchQueries={() => [
      {
        query: GET_COUNTER,
      },
    ]}>
    {(increment, { data }) => (
      <IntlConsumer>
        {({ switchToLocale }) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              increment()
              switchToLocale('zh-Hant-HK')
            }}>
            {data ? data.increment.count : children}
          </Button>
        )}
      </IntlConsumer>
    )}
  </Mutation>
)

const Counter = () => (
  <Query query={GET_COUNTER}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`
      const name = 'World'
      return (
        <>
          <IncrementButton>{data.counter.count}</IncrementButton>
          <p>
            <FormattedMessage
              id="welcome"
              defaultMessage={`Hello {name}, you have {unreadCount, number} {unreadCount, plural, one {message} other {messages}}`}
              values={{
                name: <b>{name}</b>,
                unreadCount: data.counter.count,
              }}
            />
          </p>
          <p>
            <Link href="/">
              <a>Home</a>
            </Link>
          </p>
        </>
      )
    }}
  </Query>
)

export default Counter
