// Imports
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv/config";
import Express from "express";
import session from "express-session";
import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator
} from "graphql-query-complexity";
import helmet from "helmet";
import { join } from "path";
import "reflect-metadata";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";

// Utils
import { GraphQLError } from "graphql";
import { redis } from "./redis";
import { Logger } from "./utils/Logger";

const main = async () => {
  // Connect to database
  await createConnection();

  // BuildSchema
  const schema = await buildSchema({
    resolvers: [join(__dirname, "/modules/**/*.ts")]
  });

  // Create ApolloServer
  const apolloServer = new ApolloServer({
    context: ({ req, res }: any) => ({ req, res }),
    formatError: formatArgumentValidationError,
    schema,
    validationRules: [
      queryComplexity({
        createError: (max: number, actual: number) => {
          return new GraphQLError(
            `La requête est trop complexe: ${actual}. La complexité maximale autorisée est de : ${max}`
          );
        },
        estimators: [
          fieldConfigEstimator(),
          simpleEstimator({
            defaultComplexity: 1
          })
        ],
        maximumComplexity: 8,
        onComplete: (complexity: number) => {
          Logger.info("Complexité de la requête:", complexity);
        },
        variables: {}
      }) as any
    ]
  });

  // Init Express
  const app = Express();

  // Init RedisStore
  const RedisStore = connectRedis(session);

  const { SECRET } = process.env;

  // Express Middlewares
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );
  app.use(helmet());
  app.use(compression());
  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        secure: process.env.NODE_ENV === "production"
      },
      name: "qid",
      resave: false,
      saveUninitialized: false,
      secret: SECRET ? SECRET : "thisissupersecret",
      store: new RedisStore({
        client: redis as any
      })
    })
  );

  // Apply middleware
  apolloServer.applyMiddleware({ app });

  // Listen ton PORT 4000
  app.listen(4000, () => {
    Logger.info("Express server started on http://localhost:4000/graphql");
  });
};

main();
