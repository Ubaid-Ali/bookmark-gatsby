require("dotenv").config()
const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb"),
  q = faunadb.query

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
})

const typeDefs = gql`
  type Query {
    message: String
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookmark(url: String!, desc: String!): Bookmark
  }
`

//  D U M M Y  D A T A
// const authors = [
//   { id: 001, url: "google.com", desc: "This is g description" },
//   { id: 002, url: "youtube.com", desc: "This is yt description" }
// ]

const resolvers = {
  Query: {
    bookmark: async (parent, args, context) => {
      try {
        // faunadb get request
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("Index-bookmarks"))),
            q.Lambda(x => q.Get(x))
          )
        )
        // console.log(`result: `, result)
        return (allBookmarks = result.data.map(d => {
          return {
            id: d.ts,
            url: d.data.url,
            desc: d.data.desc,
          }
        }))
      } catch (error) {
        console.log(`error: `, error)
        console.log(`Something Went Wrong While Getting the Data.`)
      }
    },
  },

  Mutation: {
    addBookmark: async (_, { url, desc }) => {
      //Create a document in the faunadb database
      try {
        const result = await client.query(
          q.Create(q.Collection("Links"), {
            data: {
              url,
              desc,
            },
          })
        )
        console.log(
          "Document Created and Inserted in Container: " + result.ref.id
        )
        console.log(`result.ts: `, result.ts)
        return {
          id: result.ts,
          url: result.data.url,
          desc: result.data.desc,
        }
      } catch (error) {
        console.log("Error: ")
        console.log(error)
        console.log(
          "No FAUNADB_SERVER_SECRET in .env file, skipping Document Creation"
        )
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
})

exports.handler = server.createHandler()
