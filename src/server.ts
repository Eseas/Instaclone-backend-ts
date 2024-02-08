require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload-ts";

const PORT = process.env.PORT;
const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const app = express();
//app.use(logger("tiny"));
app.use(graphqlUploadExpress());
app.use(express.static("uploads"));
server.start().then(res => {
  server.applyMiddleware({ app, path: '/' });

  app.listen({ port : PORT }, () => 
    console.log(`🚀Server is running on http://localhost:${PORT} ✅`)
  );  
});