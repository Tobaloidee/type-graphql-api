import pino from "pino";

export const Logger = pino({
  name: "type-graphql-api",
  prettyPrint: true
});
