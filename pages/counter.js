import React from 'react'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import Button from '@material-ui/core/Button'
import Link from 'next/link'

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
  <Mutation mutation={INCREMENT_COUNTER} variables={{ step: 1 }}>
    {(increment, { data }) => (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          increment(1)
        }}>
        {data ? data.increment.count : children}
      </Button>
    )}
  </Mutation>
)

const Counter = () => (
  <Query query={GET_COUNTER}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...'
      if (error) return `Error! ${error.message}`

      return (
        <>
          <IncrementButton>{data.counter.count}</IncrementButton>
          <p>
            <Link to="/">Home</Link>
          </p>
        </>
      )
    }}
  </Query>
)

export default Counter
