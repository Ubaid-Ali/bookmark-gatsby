import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

// This query is executed at run time by Apollo.
const APOLLO_QUERY = gql`
  {
    bookmark {
      id
      url
      desc
    }
  }
`

const addBookmarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!) {
    addBookmark(url:$url, desc:$desc) {
      url
    }
  }
`

export default function Home() {
  const { loading, error, data} = useQuery(APOLLO_QUERY)
  const [addBookmark] = useMutation(addBookmarkMutation)
  console.log(`data`, data)

  let textfield
  let desc
  const addBookmarkSubmit = e => {
    e.preventDefault()
    addBookmark({
      variables: {
        url: textfield.value,
        desc: desc.value,
      },
    })
    console.log(`textfield`, textfield.value)
    console.log(`desc`, desc.value)
  }

  return (
    <div>
      <form onSubmit={addBookmarkSubmit}>
        <input type="text" ref={node => (textfield = node)} />
        <input type="text" ref={node => (desc = node)} />
        <button type="submit">Add Bookmark</button>
      </form>
      <h2>
        Data Received from Apollo Client at runtime from Serverless Function:
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: ${error.message}</p>}
      {data && data.bookmark && (
        <div>
          <ul>
            {data.bookmark.map(obj => {
              return (
                <li key={obj.id}>
                  {obj.url} <br /> {obj.desc}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
