import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import "reflect-metadata";

const app = fastify({ logger: true });

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("server is running");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
