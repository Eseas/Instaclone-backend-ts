import "dotenv/config";
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    } from  "apollo-server-core";
import {ApolloServer} from "apollo-server";
import schema from "./schema.js";

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
});

const PORT = process.env.PORT;

server
    .listen(PORT)
    .then(() => console.log("Server is running on http://localhost:${PORT}/"));