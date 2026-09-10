import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import "reflect-metadata";
import { validateEnv, env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import cors from "@fastify/cors";
import { AppDataSource } from "./db/data-source";
import { eventsRoutes } from "./modules/events/events.routes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

const app = fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const start = async () => {
  try {
    validateEnv();

    await app.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: "MeetAndJam API",
          description:
            "API for platform for connecting musicians for jam sessions.",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:3000",
            description: "Development server",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      transform: jsonSchemaTransform,
    });

    await app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false,
      },
    });

    app.decorate("authenticate", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        console.error(error);
        reply.code(401).send({
          message: "Unauthorized",
        });
      }
    });

    app.register(authRoutes, {
      prefix: "/auth",
    });

    app.register(eventsRoutes, {
      prefix: "/events",
    });

    app.register(fastifyJwt, {
      secret: env.jwtSecret,
    });

    await AppDataSource.initialize();
    await app.listen({ port: env.port, host: env.host });
    console.log("server is running on port " + env.port);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
