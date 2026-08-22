import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import "reflect-metadata";
import { validateEnv, env } from "./config/env";
const app = fastify({ logger: true });
const start = async () => {
  try {
    validateEnv();
    await app.listen({ port: env.port, host: env.host });
    console.log("server is running on port " + env.port);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
