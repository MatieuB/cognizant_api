import { GraphQLServer } from "graphql-yoga";

import { schema } from "./src/graphql/schema";

const server = new GraphQLServer({ schema });
const port = process.env.PORT || 3000;

const options = {
  port,
  endpoint: "/graphql",
  playground: "/playground"
};

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
