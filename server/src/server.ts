import fastify, { FastifyError } from "fastify";
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
import { AppError } from "./types/errors";

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

    app.setErrorHandler((error: AppError, request, reply) => {
      if (error.status && error.code) {
        return reply.code(error.status).send({
          status: error.status,
          code: error.code,
          message: error.message,
        });
      }

      if (error.code === "FST_ERR_VALIDATION") {
        return reply.code(400).send({
          status: 400,
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details:
            error.validation?.map((v) => ({
              path: v.instancePath.replace(/^\//, "").split("/"),
              message: v.message,
            })) ?? [],
        });
      }

      if (error.code === "FST_ERR_CTP_INVALID_JSON_BODY") {
        return reply.code(400).send({
          status: 400,
          code: "INVALID_JSON",
          message: "Body is not valid JSON",
        });
      }

      if (error.code === "FST_ERR_CTP_INVALID_MEDIA_TYPE") {
        return reply.code(415).send({
          status: 415,
          code: "INVALID_MEDIA_TYPE",
          message: "Unsupported media type",
        });
      }

      request.log.error(error);
      return reply.code(500).send({
        status: 500,
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      });
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
        reply.code(401).send({
          status: 401,
          code: "UNAUTHORIZED",
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
