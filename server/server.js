// Render React front-end code
const path = require("path");

const express = require("express");

// Import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// Import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

const db = require("./config/connection");

// Import authMiddleware
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;

// Create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();

// Integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get('*',(req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start up GraphQL server 
db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});