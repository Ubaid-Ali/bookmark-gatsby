const { ApolloServer, gql } = require("apollo-server-lambda");

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
`;

const authors = [
  { id: 001, url: "https://www.google.com", desc: "This is google description" },
  { id: 002, url: "https://www.facebook.com", desc: "This is facebook description" },
  { id: 003, url: "https://www.youtube.com", desc: "This is youtube description" }
]

const resolvers = {
  Query: {
    bookmark: (parent, args, context) => authors
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();