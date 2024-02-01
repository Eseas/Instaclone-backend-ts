require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema.js";
import { getUser } from "./users/users.utils.js";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

async function startApolloServer(typeDefs, resolvers) {
    const PORT = process.env.PORT;
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return {
                loggedInUser: await getUser(req.headers.token),
            };
        },
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await server.start();
    const app = express();
    app.use(logger("tiny"));
    app.use(graphqlUploadExpress());
    server.applyMiddleware({ app });
    app.listen({port: PORT}, () => {
        console.log(`Sever is running on http://localhost:${PORT}/graphql`);
    });
}

startApolloServer(typeDefs, resolvers);