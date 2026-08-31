import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import "reflect-metadata";
import { validateEnv, env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import cors from "@fastify/cors";

const app = fastify({ logger: true });

const start = async () => {
  try {
    validateEnv();

    await app.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    app.decorate("authenticate", async (reqest, reply) => {
      try {
        await reqest.jwtVerify();
      } catch (error) {
        console.error(error);
        reply.code(401).send({
          message: "Unauthirized",
        });
      }
    });
    app.register(authRoutes, {
      prefix: "/auth",
    });
    app.register(fastifyJwt, {
      secret: env.jwtSecret,
    });
    await app.listen({ port: env.port, host: env.host });
    console.log("server is running on port " + env.port);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
